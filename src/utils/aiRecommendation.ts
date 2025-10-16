import { Medicine } from '@/types/medicine';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string; temperature?: number; max_tokens?: number }) => Promise<string | any>;
      };
    };
  }
}

export interface QuestionnaireData {
  symptoms: string[];
  severity: string;
  duration: string;
  age: string;
  weight?: string;
  height?: string;
  existingConditions: string[];
  currentMedications?: string[];
  allergies: string[];
  lifestyleFactors?: string[];
  previousTreatments?: string;
  location?: string;
}

export async function getAIRecommendations(
  questionnaireData: QuestionnaireData,
  availableMedicines: Medicine[]
): Promise<{ recommendations: Medicine[]; explanation: string }> {
  try {
    const medicineList = availableMedicines
      .map(m => `${m.name} - Uses: ${m.uses}`)
      .join('\n');

    const prompt = `You are an experienced medical advisor with access to comprehensive pharmaceutical knowledge. Based on the following detailed patient information, recommend the most appropriate medicines.

Patient Information:
- Symptoms: ${questionnaireData.symptoms.join(', ')}
- Severity: ${questionnaireData.severity}
- Duration: ${questionnaireData.duration}
- Age: ${questionnaireData.age}
- Weight: ${questionnaireData.weight || 'Not specified'}
- Height: ${questionnaireData.height || 'Not specified'}
- Existing Conditions: ${questionnaireData.existingConditions.join(', ') || 'None'}
- Current Medications: ${questionnaireData.currentMedications?.join(', ') || 'None'}
- Allergies: ${questionnaireData.allergies.join(', ') || 'None'}
- Lifestyle Factors: ${questionnaireData.lifestyleFactors?.join(', ') || 'None'}
- Previous Treatments: ${questionnaireData.previousTreatments || 'None'}

Reference Medicines from Database:
${medicineList.slice(0, 30)}

Instructions:
1. Use your comprehensive medical knowledge to recommend the most effective medicines
2. Consider both over-the-counter and prescription options
3. Prioritize medicines from the reference list above, but also suggest other widely-available medicines if more suitable
4. Consider drug interactions, contraindications, and patient-specific factors
5. Provide evidence-based recommendations

Please respond in this exact format:
RECOMMENDED MEDICINES: [list 3-5 medicine names separated by commas, including generic and brand names]
EXPLANATION: [detailed explanation covering: why these medicines are suitable, how they address the symptoms, important precautions, and whether doctor consultation is recommended]

Important: Recommend medicines that are commonly available worldwide.`;

    const response = await window.puter.ai.chat(prompt, {
      model: 'gpt-5-mini',
      max_tokens: 800
    });

    // Handle response - it might be a string or an object
    let responseText = '';
    if (typeof response === 'string') {
      responseText = response;
    } else if (response && typeof response === 'object') {
      // Handle object response format
      responseText = response.text || response.content || response.message || JSON.stringify(response);
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid AI response format');
    }

    console.log('AI Response:', responseText);

    // Parse the AI response
    const recommendedMatch = responseText.match(/RECOMMENDED MEDICINES:\s*(.+)/i);
    const explanationMatch = responseText.match(/EXPLANATION:\s*(.+)/is);

    const recommendedNames = recommendedMatch 
      ? recommendedMatch[1].split(',').map(name => name.trim().toLowerCase())
      : [];

    const recommendations = availableMedicines.filter(medicine =>
      recommendedNames.some(name => medicine.name.toLowerCase().includes(name))
    );

    const explanation = explanationMatch ? explanationMatch[1].trim() : responseText;

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
      max_tokens: 300
    });

    // Handle response format
    let responseText = '';
    if (typeof response === 'string') {
      responseText = response;
    } else if (response && typeof response === 'object') {
      responseText = response.text || response.content || response.message || JSON.stringify(response);
    }

    console.log('Pharmacy Response:', responseText);

    // Parse the response into an array
    const pharmacies = responseText
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
