# ALOLA: An interactive web-based natural product biosynthetic model builder
##  An online tool for visualization and customization of biosynthetic gene clusters
**ALOLA** is designed to visualize and customize biosynthetic gene clusters (BGCs) from antiSMASH results. It offers real-time interactivity, support for various BGC types, integration of tailoring enzymes, and a user-friendly interface for modifying pathways. The tool bridges genomic data and chemical structures, providing researchers with the ability to explore, design, and modify biosynthetic pathways.

## Features:

**User-Friendly Interface:** Perform complex operations with just a few clicks.

**Real-time Interactivity:** Modify BGCs and visualize changes in real-time.

**Support for Various BGC Types:** Works with NRPS, PKS systems, RiPPs, Terpenes, and more.

**Tailoring Enzyme Integration:** Easily add and customize tailoring enzymes.

**Flexible Starting Points:** Import antiSMASH results, use pre-loaded examples, or design BGCs from scratch.

**Exportable Results:** Export pathways and predicted structures in multiple formats (e.g., SVG, PNG, SMILES).

## Packages:
One of the key components of ALOLA is **RAIChU**, or Reaction Analysis through Imaging of Chemical Units. This Python-based tool, developed specifically for visualizing natural product chemistry, handles all the structure computation and visualization tasks. RAIChU itself is built upon **PIkachu**, a Python-based Informatics Kit for the Analysis of Chemical Units, which provides the core functionalities for chemical informatics and structural analysis. 

## Installation and Running ALOLA Locally

Follow these steps to set up and run ALOLA on your local computer to make your own local server:

**1. Create a New Directory**

Open a terminal and create a new directory where you want to set up ALOLA:

**2. Clone the ALOLA Repository**

Clone the ALOLA repository from GitHub into the newly created directory:
```
git clone git@github.com:FriederikeBiermann/Alola.git
```

**3. Clone the RAIChU Package**

Inside the cloned Alola directory, clone the RAIChU package:
```
git clone https://github.com/BTheDragonMaster/RAIChU.git
```

**4. Clone the Pikachu Package**

Also, clone the Pikachu package into the Alola directory:
```
git clone https://github.com/FriederikeBiermann/pikachu.git
```

**5. Build the Docker Image for ALOLA**

Once both packages are cloned, create a Docker image for ALOLA by running:
```
sudo docker build -t alola .
```

**6. Run ALOLA**

After building the image, run ALOLA using Docker:
```
sudo docker run -it -p 8000:8000 -p 3000:3000 alola
```

**7. Access ALOLA in Your Browser**

Open your preferred web browser (e.g., Mozilla Firefox) and enter the following URL to access ALOLA:
```
http://localhost:3000/
```
