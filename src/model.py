from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from datetime import datetime, timedelta
from tensorflow.keras.layers import Activation

# Votre code ici

app = Flask(_name_)

# Load and preprocess data
data = pd.read_csv('synthetic_waste_management_data_time_bin_id.csv')
data['timestamp'] = pd.to_datetime(data['timestamp'])

encoder = OneHotEncoder(sparse=False)
scaler = StandardScaler()

def preprocess_data(data):
    X = data[['bin_id', 'timestamp']]
    y = data['level']
    bin_ids_encoded = encoder.fit_transform(X[['bin_id']])
    bin_ids_encoded = pd.DataFrame(bin_ids_encoded, columns=[f'bin_id_{int(i)}' for i in encoder.categories_[0]])
    X = pd.concat([X.drop(columns='bin_id'), bin_ids_encoded], axis=1)
    X['timestamp'] = (pd.to_datetime(X['timestamp']) - pd.to_datetime(X['timestamp']).min()).dt.total_seconds() / 60
    X_scaled = scaler.fit_transform(X)
    return X_scaled, y

X, y = preprocess_data(data)

model = Sequential([
    Dense(128, activation='relu', input_shape=(X.shape[1],)),
    Dense(64, activation='relu'),
    Dense(1),
])
model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X, y, epochs=20, batch_size=32)

def make_predictions(timestamp):
    # Create DataFrame to store predictions
    predictions_df = pd.DataFrame(columns=['timestamp', 'bin_id', 'prediction'])

    # Generate timestamp for the next 4 hours
    future_timestamp = timestamp + timedelta(hours=4)

    for bin_id in range(1, 12):  # Iterate over all bins
        # Create input features for the given bin and timestamp
        input_data = pd.DataFrame({'timestamp': [future_timestamp], 'bin_id': [bin_id]})
        bin_id_encoded = pd.DataFrame(encoder.transform(input_data[['bin_id']]), columns=[f'bin_id_{int(i)}' for i in range(1, 12)])
        input_data = pd.concat([input_data.drop(columns='bin_id'), bin_id_encoded], axis=1)

        # Standardize input data
        input_data['timestamp'] = (input_data['timestamp'] - data['timestamp'].min()).dt.total_seconds() / 60
        input_data_scaled = scaler.transform(input_data)  # Pass entire input_data instead of just 'timestamp'

        # Make predictions for the given bin and timestamp
        bin_predictions = model.predict(input_data_scaled)


        # Store predictions in DataFrame
        new_row = pd.DataFrame({'timestamp': [future_timestamp], 'bin_id': [bin_id], 'prediction': bin_predictions.flatten()})
        predictions_df = pd.concat([predictions_df, new_row], ignore_index=True)

    return predictions_df



@app.route('/predict', methods=['POST'])
def predict():
    request_data = request.get_json()
    
    # Obtenir l'horodatage envoyé dans la requête
    timestamp_str = request_data.get('timestamp')
    
    # Convertir l'horodatage en objet datetime
    timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S') if timestamp_str else datetime.now()
    
    # Faire des prédictions pour l'heure actuelle plus 4 heures
    predictions = make_predictions(timestamp)
    
    return predictions.to_json(orient='records')

if _name_ == '_main_':
    app.run(debug=False)