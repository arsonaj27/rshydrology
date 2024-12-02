import os
import rasterio
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

tiff_dir = 'D:/RS Folder/kulekhani_yearly_surface_map'
output_csv = 'D:/RS Folder/kulekhani_yearly_surface_map/Surface Water Area Yearly.csv'
output_png = 'D:/RS Folder/kulekhani_yearly_surface_map/Yearly Surface Water Area'

results = []

for filename in os.listdir(tiff_dir):
    if filename.endswith('.tif'):
        file_path = os.path.join(tiff_dir, filename)        
        year = filename.split('_')[-1].split('.')[0]  # Extracts the year part correctly        
        
        with rasterio.open(file_path) as src:            
            pixel_area_km2 = 900/1000000 # Resolution of image is 30m which is then converted to km2 area     
            red_band = src.read(1)
            green_band = src.read(2)
            blue_band = src.read(3)      

            water_pixels = (red_band == 0) & (green_band == 0) & (blue_band > 250)
            water_pixel_count = np.sum(water_pixels)      

            surface_water_area_km2 = water_pixel_count * pixel_area_km2
            results.append({'Year': int(year), 'Surface Water Area (km2)': surface_water_area_km2})
                             
df = pd.DataFrame(results)
df = df.sort_values('Year')  
df.to_csv(output_csv, index=False)
print(f"Results Saved")

plt.figure(figsize=(10, 5))
plt.plot(df['Year'], df['Surface Water Area (km2)'], marker='.',markersize=4, linestyle='-',linewidth=0.85)
plt.title('Surface Water Area Over Time')
plt.xlabel('Year')
plt.ylabel('Surface Water Area (km²)')
plt.grid()
plt.savefig(output_png, dpi=600)
plt.show()
