# Surface Water Area Estimation and Trend Analysis Using Remote Sensing Data

This repository provides a comprehensive time series analysis of surface water mapping for the Kulekhani Reservoir, aimed at understanding temporal patterns and trends in surface water extent.

The **Surface Water Monthly** script, created using Google Earth Engine (GEE), facilitates the downloading and management of surface water animations on a monthly basis. This tool enables researchers to track changes in water extent with high temporal granularity. To generate monthly surface water maps, the **surfacewatermappingmonthly** script is utilized, specifically designed for precise monthly mapping of surface water dynamics.

For extracting surface water areas from the JRC dataset, the **Yearly Plots.py** file plays a crucial role. This script generates time series data, providing insights into water extent changes over time based on the JRC dataset. In addition, the **Monthly Plots Yearwise** script offers detailed access to monthly datasets, enabling year-wise visualization and analysis of surface water variations.

A detailed analysis comparing the monthly graphs derived from the JRC dataset with in-situ observations highlights significant findings. It becomes evident that the accuracy and reliability of data from Landsat images or the JRC dataset diminish during monsoon seasons. This discrepancy underscores the importance of limiting reliance on these datasets to non-monsoon periods when data quality is more consistent. For monsoon and high-variability seasons, alternative methods such as Sentinel imagery or direct in-situ measurements are recommended. These alternatives can provide the additional precision and reliability required for robust hydrological analyses, ensuring comprehensive seasonal coverage and accurate monitoring of surface water dynamics.

