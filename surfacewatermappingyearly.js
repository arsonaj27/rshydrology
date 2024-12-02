var geometry = ee.Geometry.Polygon([
  [85.12130788331041, 27.569046531324418],
  [85.19460729126939, 27.569046531324418],
  [85.19460729126939, 27.62700792983123], 
  [85.12130788331041, 27.62700792983123], 
  [85.12130788331041, 27.569046531324418] 
]);
Map.centerObject(geometry, 12);

Map.addLayer(geometry, {color: 'blue'}, 'Kulekhani Reservoir Boundary'); //Adding layer to visualize boundary

var gswYearly = ee.ImageCollection("JRC/GSW1_4/YearlyHistory"); // Loading JRC Yearly dataset

var years = ee.List.sequence(1990, 2020); // Defining year range from 1990 to 2020

var yearlyWater = years.map(function(year) {
  var filtered = gswYearly.filter(ee.Filter.eq('year', year));
  var yearImage = ee.Image(filtered.first());
  

  var water = yearImage.eq(2).or(yearImage.eq(3));  //As defined in the JRC yearly water dataset
  
  return water.selfMask().set('year', year);
});

var visParams = {
  min: 0,
  max: 1,
  palette: ['white', 'blue']  //Visualize the water pixels by blue colour
};

// Convert yearlywater to an image collection with visualization
var yearlyWaterVisualized = ee.ImageCollection(yearlyWater.map(function(image) {
  image = ee.Image(image);
  var year = image.get('year');
  var date = image.get('date');
  
  return image
    .unmask(0)
    .visualize(visParams)
    .clip(geometry)
    .set('year', year)
    .set('date', date);
}));

print(yearlyWaterVisualized);

// Export each yearly image to Google Drive as individual images
years.getInfo().forEach(function(year) {
  var image = yearlyWaterVisualized.filter(ee.Filter.eq('year', year)).first();
  var date = image.get('date').getInfo(); 
  var fileName = 'SurfaceWater_Kulekhani_' + year;
  
  Export.image.toDrive({
    image: ee.Image(image),
    description: fileName,
    folder: 'earthengine',
    fileNamePrefix: fileName,
    region: geometry,
    scale: 30,
    maxPixels: 1e9
  });
});

// Surface water animation
// Adapted from https://github.com/spatialthoughts/courses/blob/master/gee-water-resources-management-supplement.Rmd
Export.video.toDrive({
  collection: yearlyWaterVisualized,
  description: 'SurfaceWater_Animation_Kulekhani',
  folder: 'earthengine',
  fileNamePrefix: 'SurfaceWater_Animation_Kulekhani', // Export the collection as video
  framesPerSecond: 1,
  dimensions: 800,
  region: geometry
});
