// Inside your UI file
import { diagnoseOffline } from '../scripts/dbService';

const handlePress = async () => {
  const outputArray = await model.run(inputTensor); // Get array from AI
  const result = await diagnoseOffline(outputArray); // Get info from DB
  
  console.log(result.diagnosis); // "Tomato Late Blight"
  console.log(result.treatment); // "Apply fungicide..."
};

calling of model and backend