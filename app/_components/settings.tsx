"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useChartParams } from "@/hooks/useApi";
import React from "react";
import { datasets, networksByDataset, predictorsByDataset } from "@/config";
import { useIsFetching } from "@tanstack/react-query";

const formSchema = z.object({
  smoothing: z.number().default(30),
  months_of_training: z.coerce.number().default(8),
  intervention_date: z.string().default("2023-01-01"),
  dependent: z.string(),
  predictors: z.array(z.string()),
  treatment_identifier: z.string(),
  controls_identifier: z.array(z.string()),
  dataset: z.string().default("growthepie"),
});

export function Settings() {
  const [params, setParams] = useChartParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: params,
  });

  const isFetching = useIsFetching({ queryKey: ["api", params] });
  const treatment_identifier = form.watch("treatment_identifier");
  const dependent_identifier = form.watch("dependent");


  // Watch for dataset changes
  const currentDataset = form.watch("dataset");

  // // Reset dependent fields when dataset changes
  // React.useEffect(() => {
  //   form.setValue("predictors", []);
  //   form.setValue("treatment_identifier", "");
  //   form.setValue("controls_identifier", []);
  // }, [currentDataset, form]);

  const availableNetworks = networksByDataset[currentDataset as keyof typeof networksByDataset];
  const availablePredictors = predictorsByDataset[currentDataset as keyof typeof predictorsByDataset];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          setParams({ ...params, ...values })
        )}
        className=""
      >
        <div className="flex gap-1 items-end">
          <FormField
            control={form.control}
            name="dataset"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dataset</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map((dataset) => (
                        <SelectItem key={dataset.value} value={dataset.value}>
                          {dataset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="treatment_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Network" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableNetworks.map((network) => (
                        <SelectItem key={network.value} value={network.value}>
                          {network.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dependent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dependent</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Dependent" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePredictors.map((predictor) => (
                        <SelectItem
                          key={predictor.value}
                          value={predictor.value}
                        >
                          {predictor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-1">
            <FormField
              control={form.control}
              name="intervention_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervention date</FormLabel>
                  <FormControl>
                    <Input placeholder="2023-01-01" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="months_of_training"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months of training</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="controls_identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Controls</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Select networks..."
                  value={field.value.filter(
                    (network) => network !== treatment_identifier
                  )}
                  onChange={(values) =>
                    field.onChange(values.map((v) => v.value))
                  }
                  options={availableNetworks.filter(
                    (network) => network.value !== treatment_identifier
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="predictors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Predictors</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Select predictors..."
                  value={field.value.filter(
                    (predictor) => predictor !== dependent_identifier
                  )}
                  onChange={(values) =>
                    field.onChange(values.map((v) => v.value))
                  }
                  options={availablePredictors.filter(
                    (predictor) => predictor.value !== dependent_identifier
                  )}                
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex-1 flex justify-end">
          <Button isLoading={Boolean(isFetching)} type="submit">
            Compute
          </Button>
        </div>
      </form>
    </Form>
  );
}
