import Admin from "../models/admin.model.js";
import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";
import { Storage } from "@google-cloud/storage";

const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const blob = bucket.file(Date.now() + "-" + file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        reject(err);
      });

      blobStream.on("finish", async () => {
        console.log("File uploaded:", file.originalname);
        try {
          // Retrieve metadata about the uploaded file
          const [metadata] = await blob.getMetadata();
          resolve(metadata);
        } catch (error) {
          console.error("Error retrieving file metadata:", error);
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    } else {
      reject(new Error("No file provided"));
    }
  });
};

const storage = new Storage({
  projectId: "38153692302",
  keyFilename: "codingwithmeet.json",
});

const bucket = storage.bucket("codingwithmeet");

export const getAllProducts = async (req, res, next) => {
  try {
    const { required } = req.body;

    if (!required || !Array.isArray(required)) {
      const products = await Product.find();
      res.status(200).json(products);
    }

    // Create a projection object for MongoDB
    const projection = {};
    required.forEach(field => {
      projection[field] = 1;
    });

    // Fetch products with the specified fields
    const products = await Product.find({}, projection);

    res.status(200).json(products);
  } catch (error) {
    next(new Error(`Error in get all products due to: ${error.message}`));
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      avgMarketEvaluation,
      approxMakingTime,
      introducedBy,
      type1,
      type2,
      name,
      dimensions,
      description,
      variants,
      themes,
      accessTo,
      numberOfSeller
    } = req.body;

    // if product already exits then we should send response
    const prodExists = await Product.findOne({ name });
    if (prodExists) {
      next(
        errorHandler(
          500,
          "Product already exits in the database with same name"
        )
      );
      return;
    }
    console.log(req.body);
    // Iterate over each uploaded file and upload it to the Google Cloud Storage bucket
    let images = [];

    for (const file of req.files) {
      try {
        const metaForFile = await uploadFile(file);
        const { name, mediaLink } = metaForFile;
        images.push({ name, mediaLink });
        console.log(metaForFile);
      } catch (error) {
        console.error("Error uploading file:", error);
        next(errorHandler(500, "Error uploading file"));
        return; // Stop execution if there's an error uploading the file
      }
    }
    // const vendorName = introducedBy.toLowerCase();
    // const user = await Admin.findOne({ name: vendorName });
    // if (!user) {
    //   return res
    //     .status(400)
    //     .json({ message: "Admin not found with the given vendor name." });
    // }
    const Nvarients = variants.split(",").map((ele) => {
      return {
        pages: ele,
      };
    });
    const Ntheme = themes.split(",").map((ele) => {
      return {
        name: ele,
      };
    });

    console.log(images);

    const resutl = new Product({
      images,
      avgMarketEvaluation,
      approxMakingTime,
      introducedBy,
      type1,
      type2,
      name,
      dimensions:JSON.parse(dimensions),
      description,
      themes:Ntheme,
      variants:Nvarients,
      accessTo,
      numberOfSeller
    });
    await resutl.save();
    res.status(200).json(resutl);
  } catch (error) {
    console.log(error);
    next(errorHandler("Error at crate product due to "+error));
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const name = req.params.id;
    const product = await Product.findOne({ _id:name });
    if (!product) {
      res
        .status(404)
        .json({ message: "No such product found in the database" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(errorHandler(500, "error in getProdcut due to ", error));
  }
};

const getMap = (newA, oldA) => {
  const Map = {};

  newA.forEach((ele) => {
    // 0 means new
    Map[ele] = 0;
  });

  oldA.forEach((ele) => {
    if (Map.hasOwnProperty(ele)) {
      // 1 means already exits
      Map[ele] = 1;
    } else {
      // -1 means it is to be deleted
      Map[ele] = -1;
    }
  });

  return Map;
};

export const updateBasicDetails = async (req, res, next) => {
  try {
    const {
      _id,
      name,
      description,
      dimensions,
      type1,
      type2,
      introducedBy,
      accessTo,
      avgMarketEvaluation,
      approxMakingTime,
      themes,
    } = req.body;
    // Find the product
    const product = await Product.findOne({ _id });
    if (!product) {
      res.status(400).json({ message: "Not found" });
    }
    product.name = name;
    product.description = description;
    product.dimensions = dimensions;
    product.type1 = type1;
    product.type2 = type2;
    product.introducedBy = introducedBy;
    product.accessTo = accessTo;
    product.avgMarketEvaluation = avgMarketEvaluation;
    product.approxMakingTime = approxMakingTime;
    product.themes = themes

    console.log(Product);
    // const currentThemes = product.themes.map((ele) => ele.name);
    // const newThemesNames = themes.split(",");
    // if (themes !== "") {
    //   const hashMap = getMap(newThemesNames, currentThemes);
    //   console.log(hashMap);

    //   // Remove themes marked as -1
    //   product.themes = product.themes.filter((ele) => hashMap[ele.name] !== -1);

    //   // Add new themes marked as 0
    //   for (const key in hashMap) {
    //     if (hashMap.hasOwnProperty(key) && hashMap[key] === 0) {
    //       // Check if theme already exists in the product
    //       const existingTheme = product.themes.find(
    //         (theme) => theme.name === key
    //       );
    //       if (!existingTheme) {
    //         // If theme doesn't exist, add it to the product
    //         product.themes.push({ name: key });
    //       }
    //     }
    //   }
    // } else {
    //   product.themes = [];
    // }

    // Now updating the images:

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(errorHandler(500, "error in updateBasicDetails due to " + error));
  }
};


export const deleteImageOfProduct = async (req, res, next) => {
  try {
    const { product_id, image_id } = req.body;
    const product = await Product.findOne({ _id: product_id });
    if (!product) {
      throw new Error(`Product ${productName} not found`);
    }
    const imageIndex = product.images.findIndex(
      (img) => img._id.toString() === image_id
    );
    if (imageIndex === -1) {
      throw new Error(`Image  not found in product ${productName}`);
    }
    const file = bucket.file(product.images[imageIndex].name);

    const exits = await file.exists();
    if (!exits[0]) {
      throw new Error(imageName + " image doesnot exists");
    }
    await file.delete();

    // Remove the image from the product's images array
    product.images.splice(imageIndex, 1);

    // Save the updated product document
    await product.save();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(errorHandler(500, "Error in deleteImage due to" + err));
  }
};

export const uploadImageOfProduct = async (req, res, next) => {
  try {
    console.log("hi");
    const { product_id } = req.body;
    const product = await Product.findOne({ _id: product_id });
    if (!product) {
      throw new Error(`Product ${productName} not found`);
    }
    const metaData = await uploadFile(req.file);
    const { name, mediaLink } = metaData;
    product.images.push({ name, mediaLink });
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    next(errorHandler(500, "Error in upload image due to" + err));
  }
};


export const addNewVarient = async (req, res, next) => {
  try {
    const { product_id, basePrice, printPrice, pages } = req.body;
    const product = await Product.findOne({ _id: product_id });
    if (!product) {
      throw new Error(`Product not found`);
    }
    if(req.file){
      const metaData = await uploadFile(req.file);
      const { name, mediaLink } = metaData;
      const obj = {
        pages,
        basePrice,
        printPrice,
        image:{
          name,
          mediaLink
        }
      }
      product.variants.push(obj);
      await product.save();
      res.status(200).json(product);
    }else{
      throw new Error("Please upload varient image as well !")
    }
  } catch (error) {
    next(errorHandler(500, "error in adding new varients due to" + error));
  }
};

export const updateVarient = async (req,res,next) =>{
  try{
    const {varient_id,product_id, basePrice, printPrice, pages} = req.body;
    const product = await Product.findOne({ _id: product_id });
    if (!product) {
      throw new Error(`Product not found`);
    }
    const varient  = product.variants.find(obj => obj._id == varient_id);
    if(!varient){
      throw new Error("No such varient found");
    }
    varient.basePrice = basePrice;
    varient.printPrice = printPrice;
    varient.pages = pages;
    if(req.file){
      const metaData = await uploadFile(req.file);
      const { name, mediaLink } = metaData;

      varient.image.name = name;
      varient.image.mediaLink = mediaLink;
    }
    await product.save();
    res.status(200).json()
  }
  catch(error){
    next(errorHandler(500, "error in adding new varients due to" + error));
  }
}

export const updatePricingVarient = async (req,res,next)=>{
  try {
    const {_id,pricing,variants} = req.body;
    const prod = await Product.findOne({_id:_id});
    if (!prod) {
      throw new Error(`Product not found`);
    }
    prod.variants = variants;
    prod.pricing = pricing;
    const newProd = await prod.save();
    res.status(200).json(newProd);
  } catch (error) {
    next(errorHandler(500, "error in adding new varients due to" + error));
  }
}