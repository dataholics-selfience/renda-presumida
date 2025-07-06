import { RendaResultType } from '../types';

export const parseRendaResponse = (rawResponse: any): RendaResultType => {
  console.log('🔍 Raw response received:', rawResponse);
  
  let jsonString = '';
  let parsedData: any = null;
  
  try {
    // Handle the specific structure: array with output property
    if (Array.isArray(rawResponse) && rawResponse.length > 0) {
      const firstItem = rawResponse[0];
      if (firstItem && firstItem.output) {
        jsonString = firstItem.output;
        console.log('📝 Extracted output string:', jsonString);
      } else if (typeof firstItem === 'object') {
        parsedData = firstItem;
      }
    } else if (typeof rawResponse === 'string') {
      jsonString = rawResponse;
    } else if (typeof rawResponse === 'object' && rawResponse !== null) {
      parsedData = rawResponse;
    }
    
    // If we have a JSON string, clean and parse it
    if (jsonString && !parsedData) {
      console.log('🧹 Original JSON string:', jsonString);
      
      // Remove markdown code block fences and clean up
      jsonString = jsonString
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
        .trim();
      
      console.log('🧹 Cleaned JSON string:', jsonString);
      
      // Parse the cleaned JSON
      try {
        parsedData = JSON.parse(jsonString);
        console.log('✅ JSON parsing successful:', parsedData);
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
        console.log('📝 Attempting regex extraction...');
        
        // Try to extract JSON object using regex
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
            console.log('✅ Regex extraction successful:', parsedData);
          } catch (regexError) {
            console.error('❌ Regex extraction failed:', regexError);
            throw new Error('Não foi possível processar a resposta do servidor. Formato JSON inválido.');
          }
        } else {
          throw new Error('Nenhum objeto JSON válido encontrado na resposta.');
        }
      }
    }
    
    console.log('📊 Final parsed data:', parsedData);
    
  } catch (error) {
    console.error('💥 Critical parsing error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Erro ao processar resposta: ${error}`);
  }

  // Validate that we have valid data
  if (!parsedData || typeof parsedData !== 'object') {
    throw new Error('Dados de renda inválidos recebidos do servidor');
  }

  // Build the result with proper validation and defaults
  const resultado: RendaResultType = {
    cargo: parsedData.cargo || 'Não informado',
    empresa: parsedData.empresa || 'Não informado',
    localidade: parsedData.localidade || 'Não informado',
    salario_estimado: {
      min: parsedData.salario_estimado?.min || 'R$ 0,00',
      max: parsedData.salario_estimado?.max || 'R$ 0,00',
      media: parsedData.salario_estimado?.media || 'R$ 0,00',
      fonte: parsedData.salario_estimado?.fonte || 'Não informado'
    },
    nivel: parsedData.nivel || 'Não informado',
    porte_empresa: parsedData.porte_empresa || 'Não informado',
    alerta_fraude: parsedData.alerta_fraude || 'Nenhum'
  };
  
  console.log('✅ Final resultado:', resultado);
  
  return resultado;
};