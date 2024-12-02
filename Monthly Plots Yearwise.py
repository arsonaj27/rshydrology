import os
import rasterio
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import calendar

tiff_dir = 'D:/RS Folder/GEE_Water_Exports'
output_csv = 'D:/RS Folder/GEE_Water_Exports/surface_water_area_monthly_yearwise.csv'

results = []

for filename in os.listdir(tiff_dir):
    if filename.endswith('.tif'):
        file_path = os.path.join(tiff_dir, filename)
        
        parts = filename.split('_')
        year_month = parts[-1].split('.')[0] 
        year, month = year_month.split('-')  

        with rasterio.open(file_path) as src:
            pixel_area_km2 = 900 / 1000000
            red_band = src.read(1)
            green_band = src.read(2)
            blue_band = src.read(3)
            
            water_pixels = (red_band == 0) & (green_band == 0) & (blue_band > 250)
            water_pixel_count = np.sum(water_pixels) 

            surface_water_area_km2 = water_pixel_count * pixel_area_km2
            
            month_name = calendar.month_name[int(month)]
            results.append({'Year': int(year), 'Month': month_name, 'Surface Water Area (Km2)': surface_water_area_km2})

df = pd.DataFrame(results)
df['Month_Number'] = df['Month'].apply(lambda x: list(calendar.month_name).index(x)) # Add a month number for sorting purposes
df = df.sort_values(['Year', 'Month_Number']).drop(columns='Month_Number')

output_dir = 'D:/RS Folder/GEE_Water_Exports/Yearly CSVs'
os.makedirs(output_dir, exist_ok=True)

for year in df['Year'].unique():
    year_df = df[df['Year'] == year]
    output_csv_monthly = os.path.join(output_dir, f'surface_water_{year}.csv')
    year_df.to_csv(output_csv_monthly, index=False)

# Generate and display plots for each year
plots_dir = 'D:/RS Folder/GEE_Water_Exports/Monthly Plots Yearwise'
os.makedirs(plots_dir, exist_ok=True)

for year in df['Year'].unique():
    year_df = df[df['Year'] == year]
    plt.figure(figsize=(10, 5))
    plt.plot(
        year_df['Month'],
        year_df['Surface Water Area (Km2)'],
        marker='.',
        linestyle='-'
    )
    plt.title(f'Surface Water Area in {year}')
    plt.xlabel('Month')
    plt.ylabel('Surface Water Area (km²)')
    plt.xticks(ticks=range(12), labels=calendar.month_name[1:], rotation=45)
    plt.grid()
    plot_path = os.path.join(plots_dir, f'Surface Water Area {year}.png')
    plt.savefig(plot_path)
    plt.show()
    plt.close()

df.to_csv(output_csv, index=False)