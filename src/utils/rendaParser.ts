import { RendaResultType } from '../types';

export const parseRendaResponse = (rawResponse: any): RendaResultType => {
  console.log('🔍 Raw response received:', rawResponse);
  
  let jsonString = '';
  let parsedData: any = null;
  
  try {
    // Handle nested array structure
    if (Array.isArray(rawResponse) && rawResponse.length > 0) {
      if (rawResponse[0].output) {
        jsonString = rawResponse[0].output;
      } else {
        // Direct array with renda data
        parsedData = rawResponse[0];
      }
    } else if (typeof rawResponse === 'string') {
      jsonString = rawResponse;
    } else if (typeof rawResponse === 'object' && rawResponse !== null) {
      parsedData = rawResponse;
    }
    
    // If we still have a string, parse it
    if (jsonString && !parsedData) {
      console.log('🧹 Original JSON string:', jsonString);
      
      // Remove markdown code block fences and clean up
      jsonString = jsonString
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      console.log('🧹 Cleaned JSON string:', jsonString);
      
      // Parse the actual renda data
      try {
        parsedData = JSON.parse(jsonString);
        console.log('✅ JSON parsing successful:', parsedData);
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
        console.log('📝 Attempting alternative parsing...');
        
        // Try to extract JSON from text using regex
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
            console.log('✅ Alternative parsing successful');
          } catch (altError) {
            console.error('❌ Alternative parsing failed:', altError);
            throw new Error('Resposta inválida do servidor. O formato dos dados não pôde ser processado.');
          }
        } else {
          throw new Error('Nenhum dado estruturado válido encontrado na resposta do servidor.');
        }
      }
    }
    
    console.log('📊 Final parsed data:', parsedData);
    
  } catch (error) {
    console.error('💥 Critical parsing error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Erro ao processar resposta da consulta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }

  // Validate that we have some data
  if (!parsedData || typeof parsedData !== 'object') {
    throw new Error('Estrutura de dados de renda inválida recebida do servidor');
  }

  // Build the result with proper validation
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