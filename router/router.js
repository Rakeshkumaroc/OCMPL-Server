const express = require("express");
const enquirySchema = require("../schema/enquirySchema");
const userSchema = require("../schema/userSchema");
const jobSchema = require("../schema/jobSchema");
const jobApplicationSchema = require("../schema/jobApplicationSchema");
const app = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import the 'fs' module to handle file system operations
const serviceSchema = require("../schema/serviceSchema");
const projectSchema = require("../schema/projectSchema");

// Resume upload
// Define the uploads directory path
const uploadsDir = path.join(__dirname, "uploads/resume");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory recursively
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/resume")); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads/resume' directory
app.use(
  "/uploads/resume",
  express.static(path.join(__dirname, "uploads/resume"))
);

// Service images upload
// Define the uploads directory path
const serviceUploadsDir = path.join(__dirname, "uploads/service");
if (!fs.existsSync(serviceUploadsDir)) {
  fs.mkdirSync(serviceUploadsDir, { recursive: true }); // Create the directory recursively
}

// Set up service storage for uploaded files
const service_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, serviceUploadsDir); // Save files in the 'uploads/service' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const serviceupload = multer({ storage: service_storage });

// Serve static files from the 'uploads/service' directory
app.use("/uploads/service", express.static(serviceUploadsDir));

//project images upload
// Define the uploads directory path for projects
const projectUploadsDir = path.join(__dirname, "uploads/project");
if (!fs.existsSync(projectUploadsDir)) {
  fs.mkdirSync(projectUploadsDir, { recursive: true }); // Create the directory recursively
}

// Set up project storage for uploaded files
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectUploadsDir); // Save files in the 'uploads/project' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const projectUpload = multer({ storage: projectStorage });

// Serve static files from the 'uploads/project' directory
app.use("/uploads/project", express.static(projectUploadsDir));

app.get("/", (req, res) => [res.send({ server: "ok" })]);

// user
app.post("/add-user", async (req, res) => {
  try {
    const { username, email, number, password } = req.body;

    // Check if the user already exists
    let existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    // Create a new user
    const newUser = new userSchema({
      username,
      email,
      number,
      password, // Consider hashing this before saving
    });

    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Server error");
    console.error("Signup error:", error);
  }
});

app.post("/login-user", async (req, res) => {
  let result = await userSchema.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(401).send("Invalid Information");
    console.log("Login failed for:", req.body.email);
  }
});

app.get("/single-user/:id", async (req, res) => {
  let result = await userSchema.findOne({ _id: req.params.id });
  res.send(result);
});

app.put("/edit-user/:id", async (req, res) => {
  try {
    let result = await userSchema.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the user.");
  }
});
app.get("/admin", async (req, res) => {
  let result = await userSchema.find();
  res.send(result);
});

app.delete("/select-user-delete", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of product IDs
    const result = await userSchema.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "User deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// enquiry
app.post("/add-enquiry", async (req, res) => {
  try {
    const addedTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const updateData = {
      ...req.body,
      addedTime,
    };

    const result = await enquirySchema.insertMany(updateData);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add enquiry" });
  }
});

app.get("/enquiry", async (req, res) => {
  let result = await enquirySchema.find();
  res.send(result);
});
app.put("/edit-enquiry/:id", async (req, res) => {
  try {
    let result = await enquirySchema.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status, assignUser: req.body.assignUser } } // Correct syntax for updating a field
      // Correct syntax for updating a field
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the enquiry.");
  }
});
app.delete("/select-enquiry-delete", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of product IDs
    const result = await enquirySchema.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Enquiry deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting enquiry", error });
  }
});

//Job Application
app.post("/add-application", upload.single("resume"), async (req, res) => {
  try {
    // Format the current time
    const addedTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    // Extract form data from req.body
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      linkedin,
      portfolio,
      currentLocation,
      coverLetter,
    } = req.body;

    // Create the application data object
    const applicationData = {
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      linkedin,
      portfolio,
      currentLocation,
      coverLetter,
      addedTime,
      resume: req.file ? req.file.path : null, // Save the file path if a file was uploaded
    };

    // Insert the application data into the database
    const result = await jobApplicationSchema.create(applicationData); // Use `create` for a single document

    // Send success response
    res
      .status(201)
      .send({ message: "Application submitted successfully!", data: result });
  } catch (error) {
    console.error("Error adding application:", error);
    res
      .status(500)
      .send({ error: "Failed to add application. Please try again later." });
  }
});
app.delete("/select-application-delete", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of application IDs

    // Find applications to get resume file paths
    const applicationsToDelete = await jobApplicationSchema.find({ _id: { $in: ids } });

    // Loop through each application and delete its resume file if it exists
    for (const app of applicationsToDelete) {
      if (app.resume) {
        // Construct the absolute path of the resume file
        const resumePath = path.join(__dirname, "uploads/resume", path.basename(app.resume));

        // Check if the file exists before deleting
        if (fs.existsSync(resumePath)) {
          fs.unlinkSync(resumePath); // Delete the file
          console.log(`Deleted file: ${resumePath}`);
        } else {
          console.log(`File not found: ${resumePath}`);
        }
      }
    }

    // Delete applications from the database
    const result = await jobApplicationSchema.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Applications deleted successfully", result });
  } catch (error) {
    console.error("Error deleting applications:", error);
    res.status(500).json({ message: "Error deleting applications", error });
  }
});

app.put("/edit-application/:id", async (req, res) => {
  try {
    let result = await jobApplicationSchema.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status, assignUser: req.body.assignUser } } // Correct syntax for updating a field
      // Correct syntax for updating a field
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the application.");
  }
});

app.get("/application", async (req, res) => {
  let result = await jobApplicationSchema.find();
  res.send(result);
});



// job

app.post("/add-job", async (req, res) => {
  try {
    const addedTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const updateData = {
      ...req.body,
      addedTime,
    };

    const result = await jobSchema.insertMany(updateData);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add job" });
  }
});

app.get("/job", async (req, res) => {
  let result = await jobSchema.find();
  res.send(result);
});

app.delete("/select-job-delete", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of product IDs
    const result = await jobSchema.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Job deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
});

app.get("/single-job/:id", async (req, res) => {
  let result = await jobSchema.findOne({ _id: req.params.id });
  res.send(result);
});

app.put("/edit-job/:id", async (req, res) => {
  try {
    let result = await jobSchema.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the user.");
  }
});

//service
app.get("/service", async (req, res) => {
  let result = await serviceSchema.find();
  res.send(result);
});

app.post(
  "/add-service",
  serviceupload.fields([
    { name: "icon", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "additionalContentImage", maxCount: 1 },
    { name: "featuresImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const addedTime = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }).format(new Date());

      // Parse features and additionalContent from JSON strings to objects
      const features = JSON.parse(req.body.features || "[]");
      const additionalContent = JSON.parse(req.body.additionalContent || "[]");
      const paragraphs = JSON.parse(req.body.paragraphs || "[]");
      const updateData = {
        ...req.body,
        addedTime,
        features, // Use the parsed features array
        additionalContent, // Use the parsed additionalContent array
        paragraphs, // Use the parsed paragraphs array
        icon: req.files["icon"] ? req.files["icon"][0].path : null,
        heroImage: req.files["heroImage"]
          ? req.files["heroImage"][0].path
          : null,
        additionalContentImage: req.files["additionalContentImage"]
          ? req.files["additionalContentImage"][0].path
          : null,
        featuresImage: req.files["featuresImage"]
          ? req.files["featuresImage"][0].path
          : null,
      };

      const result = await serviceSchema.insertMany(updateData);
      res.status(201).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to add service" });
    }
  }
);

app.put(
  "/edit-service/:id",
  serviceupload.fields([
    { name: "icon", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "additionalContentImage", maxCount: 1 },
    { name: "featuresImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Parse features and additionalContent from JSON strings to objects
      const features = JSON.parse(req.body.features || "[]");
      const additionalContent = JSON.parse(req.body.additionalContent || "[]");
      const paragraphs = JSON.parse(req.body.paragraphs || "[]");
      // Prepare the update data
      const updateData = {
        ...req.body,
        features, // Use the parsed features array
        additionalContent, // Use the parsed additionalContent array
        paragraphs, // Use the parsed paragraphs array
      };

      // Handle file uploads and update file paths if files are uploaded
      if (req.files["icon"]) {
        updateData.icon = req.files["icon"][0].path;
      }
      if (req.files["heroImage"]) {
        updateData.heroImage = req.files["heroImage"][0].path;
      }
      if (req.files["additionalContentImage"]) {
        updateData.additionalContentImage =
          req.files["additionalContentImage"][0].path;
      }
      if (req.files["featuresImage"]) {
        updateData.featuresImage = req.files["featuresImage"][0].path;
      }

      // Update the service in the database
      const result = await serviceSchema.updateOne(
        { _id: id },
        { $set: updateData }
      );

      // Send the response
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to update service" });
    }
  }
);

app.delete("/select-service-delete", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of service IDs

    // Find services to delete and extract image paths
    const servicesToDelete = await serviceSchema.find({ _id: { $in: ids } });

    // Extract all image paths from services
    const imagePaths = [];
    servicesToDelete.forEach((service) => {
      ["icon", "heroImage", "additionalContentImage", "featuresImage"].forEach((field) => {
        if (service[field]) imagePaths.push(service[field]); 
      });
    });

    // Check if each image is used in other services
    for (const imagePath of imagePaths) {
      const filename = path.basename(imagePath); // Get only the filename

      const isImageUsedElsewhere = await serviceSchema.exists({
        $or: [
          { icon: new RegExp(filename) },
          { heroImage: new RegExp(filename) },
          { additionalContentImage: new RegExp(filename) },
          { featuresImage: new RegExp(filename) },
        ],
        _id: { $nin: ids }, // Exclude the deleting services
      });

      if (!isImageUsedElsewhere) {
        // Image is NOT used elsewhere → Safe to delete the file
        const fullPath = path.join(__dirname, "uploads/service", filename);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    // Finally, delete the services from the database
    const result = await serviceSchema.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Services deleted successfully", result });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Error deleting service", error });
  }
});

app.get("/single-service/:id", async (req, res) => {
  let result = await serviceSchema.findOne({ _id: req.params.id });
  res.send(result);
});

//project
app.get("/project", async (req, res) => {
  let result = await projectSchema.find();
  res.send(result);
});

// Add Project API
app.post("/add-project", projectUpload.single("imageUrl"), async (req, res) => {
  try {
    const addedTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    // Log file path only if req.file exists
    if (req.file) {
      console.log(req.file.path);
    } else {
      console.log("No file uploaded");
    }

    // Prepare the data to be saved
    const projectData = {
      ...req.body,
      addedTime,
      imageUrl: req.file ? req.file.path : null, // Store the file path if uploaded
    };

    // Save the project data to the database
    const result = await projectSchema.create(projectData);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add project" });
  }
});

// Edit Project API
app.put(
  "/edit-project/:id",
  projectUpload.single("imageUrl"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prepare the update data
      const updateData = {
        ...req.body,
      };

      // Log file path only if req.file exists
      if (req.file) {
        console.log(req.file.path);
        updateData.imageUrl = req.file.path;
      } else {
        console.log("No file uploaded");
      }

      // Update the project in the database
      const result = await projectSchema.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      // Check if project exists
      if (!result) {
        return res.status(404).send({ error: "Project not found" });
      }

      // Send the response
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to update project" });
    }
  }
);
app.delete("/select-project-delete", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of project IDs

    // Find the projects to get image URLs
    const projectsToDelete = await projectSchema.find({ _id: { $in: ids } });

    // Extract image filenames from projects being deleted
    const imageFilenames = projectsToDelete
      .map((project) => project.imageUrl)
      .filter(Boolean) // Remove undefined/null values
      .map((imageUrl) => path.basename(imageUrl)); // Extract only filename

    // Check if these images are used in other projects
    for (const filename of imageFilenames) {
      const isImageUsedElsewhere = await projectSchema.exists({
        imageUrl: new RegExp(filename), // Check if this image is used in other projects
        _id: { $nin: ids }, // Exclude the projects being deleted
      });

      if (!isImageUsedElsewhere) {
        // Image is NOT used elsewhere → Safe to delete the file
        const imagePath = path.join(__dirname, "uploads/project", filename);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // Finally, delete the projects from the database
    const result = await projectSchema.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Projects deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
});

app.get("/single-project/:id", async (req, res) => {
  let result = await projectSchema.findOne({ _id: req.params.id });
  res.send(result);
});

module.exports = app;
