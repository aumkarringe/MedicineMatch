import { Medicine } from '@/types/medicine';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string; temperature?: number; max_tokens?: number }) => Promise<string>;
      };
    };
  }
}

export interface QuestionnaireData {
  symptoms: string[];
  severity: string;
  duration: string;
  age: string;
  existingConditions: string[];
  allergies: string[];
}

export async function getAIRecommendations(
  questionnaireData: QuestionnaireData,
  availableMedicines: Medicine[]
): Promise<{ recommendations: Medicine[]; explanation: string }> {
  try {
    const medicineList = availableMedicines
      .map(m => `${m.name} - Uses: ${m.uses}`)
      .join('\n');

    const prompt = `You are a medical advisor assistant. Based on the following patient information, recommend the most suitable medicines from the available list.

Patient Information:
- Symptoms: ${questionnaireData.symptoms.join(', ')}
- Severity: ${questionnaireData.severity}
- Duration: ${questionnaireData.duration}
- Age: ${questionnaireData.age}
- Existing Conditions: ${questionnaireData.existingConditions.join(', ') || 'None'}
- Allergies: ${questionnaireData.allergies.join(', ') || 'None'}

Available Medicines:
${medicineList.slice(0, 50)}

Please respond in this exact format:
RECOMMENDED MEDICINES: [list medicine names separated by commas]
EXPLANATION: [brief explanation of why these medicines are suitable]

Important: Only recommend medicines from the available list above.`;

    const response = await window.puter.ai.chat(prompt, {
      model: 'gpt-5-mini',
      temperature: 0.3,
      max_tokens: 500
    });

    // Parse the AI response
    const recommendedMatch = response.match(/RECOMMENDED MEDICINES:\s*(.+)/i);
    const explanationMatch = response.match(/EXPLANATION:\s*(.+)/is);

    const recommendedNames = recommendedMatch 
      ? recommendedMatch[1].split(',').map(name => name.trim().toLowerCase())
      : [];

    const recommendations = availableMedicines.filter(medicine =>
      recommendedNames.some(name => medicine.name.toLowerCase().includes(name))
    );

    const explanation = explanationMatch ? explanationMatch[1].trim() : response;

    return {
      recommendations: recommendations.length > 0 ? recommendations : availableMedicines.slice(0, 5),
      explanation
    };
  } catch (error) {
    console.error('AI recommendation error:', error);
    return {
      recommendations: availableMedicines.slice(0, 5),
      explanation: 'Unable to get AI recommendations. Showing top-rated medicines instead.'
    };
  }
}

export async function findNearbyPharmacies(location: string): Promise<string[]> {
  try {
    const prompt = `List 5 well-known pharmacy chains and medical stores that would be available in or near ${location}. 
    
    Format your response as a simple list, one per line, like:
    - Apollo Pharmacy
    - MedPlus
    etc.`;

    const response = await window.puter.ai.chat(prompt, {
      model: 'gpt-5-nano',
      temperature: 0.5,
      max_tokens: 200
    });

    // Parse the response into an array
    const pharmacies = response
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace('-', '').trim())
      .filter(line => line.length > 0);

    return pharmacies.length > 0 ? pharmacies : [
      'Local Pharmacy',
      'City Medical Store',
      'Healthcare Plus',
      'MedCare Pharmacy',
      'Wellness Drugstore'
    ];
  } catch (error) {
    console.error('Pharmacy finder error:', error);
    return [
      'Local Pharmacy',
      'City Medical Store', 
      'Healthcare Plus',
      'MedCare Pharmacy',
      'Wellness Drugstore'
    ];
  }
}
