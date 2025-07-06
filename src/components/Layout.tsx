import { useState, useEffect } from 'react';
import { Briefcase, MessageCircle } from 'lucide-react';
import RendaConsultation from './RendaConsultation';
import { RendaResultType } from '../types';
import { parseRendaResponse } from '../utils/rendaParser';

interface LayoutProps {
  onResultReady: (result: RendaResultType) => void;
}

const Layout = ({ onResultReady }: LayoutProps) => {
  const [consultationCount, setConsultationCount] = useState(() => {
    const saved = localStorage.getItem('consultationCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleConsultation = async (formData: any, sessionId: string): Promise<RendaResultType> => {
    if (consultationCount >= 10) {
      throw new Error('Limite de 10 consultas atingido. Entre em contato pelo WhatsApp para continuar.');
    }

    try {
      console.log('🚀 Starting renda consultation for:', formData);
      
      const response = await fetch('https://primary-production-2e3b.up.railway.app/webhook/renda-presumida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cargo: formData.cargo,
          empresa: formData.empresa,
          localidade: formData.localidade,
          salario_declarado: formData.salario_declarado,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Webhook response error:', response.status, errorText);
        throw new Error(`Erro na consulta: ${response.status} - ${errorText}`);
      }

      const rawResponse = await response.json();
      console.log('📥 Raw webhook response:', rawResponse);
      
      const resultado = parseRendaResponse(rawResponse);
      console.log('✅ Final consultation result:', resultado);

      // Update consultation count
      const newCount = consultationCount + 1;
      setConsultationCount(newCount);
      localStorage.setItem('consultationCount', newCount.toString());

      // Set result and navigate
      onResultReady(resultado);

      return resultado;
    } catch (error) {
      console.error('💥 Error in consultation:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Erro inesperado na consulta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Renda Presumida</h1>
                <p className="text-sm text-gray-600">Análise inteligente de salários e detecção de fraudes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Consultas restantes</div>
                <div className="text-lg font-bold text-blue-600">{10 - consultationCount}</div>
              </div>
              
              {consultationCount >= 10 && (
                <a 
                  href="https://wa.me/5511995736666" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                  Contato WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <RendaConsultation 
          onConsultation={handleConsultation}
          consultationCount={consultationCount}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2025 Renda Presumida. Ferramenta de análise salarial e detecção de fraudes.
          </p>
          <div className="mt-4">
            <a 
              href="https://wa.me/5511995736666" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <MessageCircle size={16} />
              Suporte via WhatsApp: (11) 99573-6666
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;