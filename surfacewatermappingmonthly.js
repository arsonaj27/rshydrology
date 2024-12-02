// You can run the code directly by clicking to this link: https://code.earthengine.google.com/55ae46d7ec5856d364ce5eee0034b5a0

var geometry = ee.Geometry.Polygon([
    [85.12130788331041, 27.569046531324418], 
    [85.19460729126939, 27.569046531324418], 
    [85.19460729126939, 27.62700792983123],  
    [85.12130788331041, 27.62700792983123],  
    [85.12130788331041, 27.569046531324418]  
  ]);
  
  Map.centerObject(geometry, 12);
  
  var dataset = ee.ImageCollection("JRC/GSW1_4/MonthlyHistory")
                .filterDate('1990-01-01', '2020-12-31');
  
  // Define visualization parameters: blue for water, white for everything else
  var visParams = {
    min: 0,
    max: 2,
    palette: ['ffffff', 'fffcb8', '0905ff']  // White for non-water, blue for water as defined in the dataset
  };
  
  
  
  // Function to mask water pixels based on bitmask
  function maskWater(image) {
    // Extract water information using bitwise AND operation
    var water = image.bitwiseAnd(3);  // Bits 0-1 represent water detection
    // Mask non-water areas (keep only where water is detected: value 2)
    return water.eq(2);
  }
  
  // Map over each image to mask non-water areas and apply visualization parameters
  var waterImages = dataset.map(function(image) {
    var waterMasked = image.updateMask(maskWater(image));
    return waterMasked.visualize(visParams).set('month', image.date().format('YYYY-MM'));
  });
  
  // Export each monthly image to Google Drive as individual images
  waterImages.toList(waterImages.size()).getInfo().forEach(function(imgInfo, index) {
    var image = ee.Image(waterImages.toList(waterImages.size()).get(index));
    var month = imgInfo.properties.month;
    Export.image.toDrive({
      image: image,
      description: 'Surface_Water_' + month,
      folder: 'GEE_Water_Exports',
      scale: 30,
      region: geometry,
      maxPixels: 1e9
    });
  });
  
  // Visualize a single month (e.g., January 2020) on the Earth Engine map
  var singleMonth = dataset.filterDate('2004-01-01', '2004-01-31')
                           .first()
                           .updateMask(maskWater(dataset.filterDate('2004-01-01', '2004-01-31').first()))
                           .visualize(visParams);
  
  // Add the single month water map to the map as a layer
  Map.addLayer(singleMonth, {}, 'Surface Water - January 2020');
  
// Surface water animation
// Adapted from https://github.com/spatialthoughts/courses/blob/master/gee-water-resources-management-supplement.Rmd
  Export.video.toDrive({
    collection: waterImages,
    description: 'Surface_Water_Animation',
    folder: 'GEE_Water_Exports',
    scale: 30,
    region: geometry,
    framesPerSecond: 2
  });
  