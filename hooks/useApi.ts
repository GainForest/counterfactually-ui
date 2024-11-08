"use client";

import { predictorsByDataset, networksByDataset } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { addMonths, subMonths } from "date-fns";
import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from "nuqs";

const apiUrl = "https://counterfactually-production.up.railway.app/synth";

// Get all possible predictor and network values across datasets
const allPredictorIds = Object.values(predictorsByDataset)
  .flatMap(predictors => predictors.map(p => p.value));

const allNetworkIds = Object.values(networksByDataset)
  .flatMap(networks => networks.map(n => n.value));

export function useChartParams() {
  return useQueryStates(
    {
      dataset: parseAsString.withDefault("growthepie"),
      view: parseAsString.withDefault("default"),
      smoothing: parseAsInteger.withDefault(1),
      months_of_training: parseAsInteger.withDefault(12),
      intervention_date: parseAsString.withDefault("2023-12-01"),
      dependent: parseAsStringEnum(allPredictorIds).withDefault("daa"),
      predictors: parseAsArrayOf(parseAsStringEnum(allPredictorIds)).withDefault([]),
      treatment_identifier: parseAsStringEnum(allNetworkIds).withDefault(allNetworkIds[4]),
      controls_identifier: parseAsArrayOf(parseAsStringEnum(allNetworkIds)).withDefault([]),
    },
    { history: "replace" }
  );
}

export function useApi() {
  const [params] = useChartParams();
  return useQuery({
    queryKey: ["api", params],
    queryFn: async () => {
      const {
        dependent,
        treatment_identifier,
        controls_identifier,
        predictors,
        months_of_training,
      } = params;

      const intervention_date = new Date(params.intervention_date);
      const time_predictors_prior_start = subMonths(
        intervention_date,
        months_of_training
      );
      const time_predictors_prior_end = subMonths(intervention_date, 2);

      const url = new URL(apiUrl);
      url.searchParams.append("dataset", params.dataset);

      return fetch(url, {
        method: "POST",
        body: JSON.stringify({
          time_predictors_prior_start: time_predictors_prior_start
            .toISOString()
            .slice(0, -5),
          time_predictors_prior_end: intervention_date
            .toISOString()
            .slice(0, -5),
          time_optimize_ssr_start: intervention_date.toISOString().slice(0, -5),
          time_optimize_ssr_end: addMonths(intervention_date, 4)
            .toISOString()
            .slice(0, -5),
          dependent,
          predictors,
          treatment_identifier,
          controls_identifier: controls_identifier.filter(
            (network) => network !== treatment_identifier
          ),
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.detail) throw new Error(data.detail);
          return {
            ...data,
            data: movingAverage(
              data.data,
              ["treatment", "synthetic"],
              params.smoothing
            ).map((v) => ({
              ...v,
              impact_ratio: v.treatment / v.synthetic,
            })),
          };
        });
    },
  });
}

function movingAverage(
  data: { date: string; treatment: number; synthetic: number }[] = [],
  keys: string[] = [],
  windowSize = 1
) {
  return data.map((_, idx, arr) => {
    const start = Math.max(0, idx - Math.floor(windowSize / 2));
    const end = Math.min(arr.length, idx + Math.ceil(windowSize / 2));
    const subset = arr.slice(start, end);

    // Calculate the average date in the window (for "centered" smoothing)
    const avgTimestamp =
      subset.reduce((acc, item) => acc + new Date(item.date).getTime(), 0) /
      subset.length;
    const avgDate = new Date(avgTimestamp).toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    // Create a new entry with smoothed date and values
    const smoothedEntry = { date: avgDate };

    // Calculate the moving average for each key
    keys.forEach((key) => {
      const average =
        subset.reduce((acc, item) => acc + item[key], 0) / subset.length;
      smoothedEntry[`${key}`] = average;
    });

    return smoothedEntry;
  });
}