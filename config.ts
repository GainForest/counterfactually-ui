export const datasets = [
  { label: "GrowThePie", value: "growthepie" },
  { label: "GainForest", value: "gainforest" },
];

export const predictorsByDataset = {
  growthepie: [
    { label: "Market Cap USD", value: "market_cap_usd" },
    { label: "Market Cap ETH", value: "market_cap_eth" },
    { label: "Daily Active Addresses", value: "daa" },
    { label: "Transaction Count", value: "txcount" },
    { label: "Fees Paid ETH", value: "fees_paid_eth" },
    { label: "Transaction Costs Median ETH", value: "txcosts_median_eth" },
    { label: "Stablecoins Market Cap", value: "stables_mcap" },
    { label: "Gas Per Second", value: "gas_per_second" },
    { label: "Total Value Locked ETH", value: "tvl_eth" },
    { label: "Total Value Locked", value: "tvl" },
    { label: "Stablecoins Market Cap ETH", value: "stables_mcap_eth" },
    { label: "Fees Paid USD", value: "fees_paid_usd" },
    { label: "Profit USD", value: "profit_usd" },
    { label: "Fully Diluted Valuation USD", value: "fdv_usd" },
    { label: "Fully Diluted Valuation ETH", value: "fdv_eth" },
    { label: "Rent Paid USD", value: "rent_paid_usd" },
    { label: "Costs Blobs ETH", value: "costs_blobs_eth" },
    { label: "Costs L1 ETH", value: "costs_l1_eth" },
    { label: "Rent Paid ETH", value: "rent_paid_eth" },
    { label: "Profit ETH", value: "profit_eth" },
    { label: "Costs Total ETH", value: "costs_total_eth" },
    { label: "Costs L1 USD", value: "costs_l1_usd" },
    { label: "Costs Total USD", value: "costs_total_usd" },
    { label: "Transaction Costs Median USD", value: "txcosts_median_usd" },
    { label: "Costs Blobs USD", value: "costs_blobs_usd" },
  ],
  gainforest: [
    { label: "Forest Cover", value: "forest_cover" },
    { label: "Rainfall", value: "rainfall" },
    { label: "Temperature", value: "temperature" },
    { label: "Population Density", value: "population_density" },
    { label: "Agricultural Land", value: "agricultural_land" },
  ],
};

export const networksByDataset = {
  growthepie: [
    { label: "Ethereum", value: "ethereum" },
    { label: "Optimism", value: "optimism" },
    { label: "Base", value: "base" },
    { label: "Polygon ZKEVM", value: "polygon_zkevm" },
    { label: "Arbitrum", value: "arbitrum" },
    { label: "Loopring", value: "loopring" },
    { label: "Metis", value: "metis" },
    { label: "Scroll", value: "scroll" },
    { label: "ZKSync Era", value: "zksync_era" },
  ],
  gainforest: [
    { label: "Amazon", value: "amazon" },
    { label: "Congo Basin", value: "congo" },
    { label: "Borneo", value: "borneo" },
    { label: "New Guinea", value: "new_guinea" },
    { label: "Madagascar", value: "madagascar" },
  ],
};
