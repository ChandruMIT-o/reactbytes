1) Samsung Galaxy Watch 6 is the primary device used to collect live sensor data. A native watch os application [with kotlin as backend] was developed to retrieve, batch and transfer data to the mobile app.
2) The edge device has an android application [with kotlin as backend], executes edge feature derivation.
3) Edge device is also programmed to perform baseline alignment and opportunistic sampling to compute the resting baselines.
4) Development Tool: Android Studio, the app which constantly runs in the background and also a full on ui to check on everything.
5) Built a parallel cloud data ingestion pipeline that uncouples the incoming preprocessed stream, routing feature vectors simultaneously into five independent, domain-specific deep learning neural networks.
6) Each model is trained on different datasets with target variables present for different computing different health score. Example: DREAMT for sleep score and WESAD for Stress, Emotional Vitality score.
7) The models are hosted through firebase tools. As serverless functions that are triggered when a new batch of derived metrics is stored in the database. 
8) Then an ST-GAT model, which is routinely trained on user's historical data will ingest on the health continuous metrics from the model cluster for forecasting and temporal analysis.
9) Model Training and server backend: Tensorflow, keras, Python. 


--------

**Technology Stack**

- **Mobile & Wearable:** Android 16 / Wear OS 5, Kotlin 2.0, Jetpack Compose (Material 3)
- **Compatibility:** Android 10+ and Wear OS 3+
- **AI/ML Frameworks:** TensorFlow 2.15+, Keras 3.0+, Python 3.11
- **Serverless Backend:** Firebase Cloud Functions (Gen 2) on Google Cloud Run
- **Compute Allocation:** 2 GB RAM & 1 vCPU per inference instance (up to 16 GiB on backend)
- **Database:** Cloud Firestore (Native Mode, NoSQL Document Store)

- https://github.com/ChandruMIT-o/HealthDataSync/blob/master/mobile/build.gradle

Here is a concise, highly refined version of your architecture stack, optimized for clarity, scannable reading, and professional presentation.

### **Mobile & Wearable Tier (Android/Wear OS)**

- **IDE:** Android Studio (Ladybug/Quail)
    
- **Mobile Target:** Android 16 (Compile/Target SDK 36)
    
- **Wearable Target:** Wear OS 5 (Compile SDK 35 / Target SDK 34)
    
- **Baseline:** Android 10+ / Wear OS 3.0+ (Min SDK 30)
    
- **Runtime:** Kotlin 2.0+ (JVM Toolchain 17)
    
- **UI Framework:** Jetpack Compose Material 3 (BOM 2025.01.00)
    
- **On-Device AI Compute:** 2GB RAM / 1 vCPU per instance trigger
    
- **Core ML Stack:** TensorFlow 2.15+, Keras 3.0+, Python 3.11
    

### **Serverless Processing Tier (Firebase Functions Gen 2)**

- **Compute Engine:** Google Cloud Run (Gen 2)
    
- **Max Memory:** 16 GiB RAM
    

### **Data Persistence Tier (Cloud Firestore)**

- **Database:** Google Cloud Firestore (Native Mode)
    
- **Model:** NoSQL Document-Store