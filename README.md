# ALOLA: An interactive web-based natural product biosynthetic model builder
##  An online tool for visualization and customization of biosynthetic gene clusters
**ALOLA** is designed to visualize and customize biosynthetic gene clusters (BGCs) from antiSMASH results. It offers real-time interactivity, support for various BGC types, integration of tailoring enzymes, and a user-friendly interface for modifying pathways. ALOLA uses **RAIChU** (Reaction Analysis through Imaging of Chemical Units), which is built on **PIkachu** (Python-based Informatics Kit for the Analysis of Chemical Units) as part of its backend; both packages need to be cloned during the local setup.

## Installation and Running ALOLA Locally

Follow these steps to set up and run ALOLA on your local computer to make your own local server:


**1. Clone the ALOLA Repository**

- Clone the ALOLA repository from GitHub:
```
git clone git@github.com:FriederikeBiermann/Alola.git
```

- Navigate to the cloned Alola directory:
```
cd Alola
```

**2. Clone the RAIChU Package**

Clone the RAIChU package:
```
git clone https://github.com/BTheDragonMaster/RAIChU.git
```

**3. Clone the PIkachu Package**

Also, clone the Pikachu package into the Alola directory:
```
git clone https://github.com/FriederikeBiermann/pikachu.git
```

**4. Build the Docker Image for ALOLA**

Once both packages are cloned, create a Docker image for ALOLA by running:
```
sudo docker build -t alola .
```

**5. Run ALOLA**

After building the image, run ALOLA using Docker:
```
sudo docker run -it -p 8000:8000 -p 3000:3000 alola
```

**6. Access ALOLA in Your Browser**

Open your preferred web browser (e.g., Mozilla Firefox) and enter the following URL to access ALOLA:
```
http://localhost:3000/
```
