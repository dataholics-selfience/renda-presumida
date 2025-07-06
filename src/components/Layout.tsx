import { useState, useEffect } from 'react';
import { Briefcase, MessageCircle, AlertTriangle } from 'lucide-react';
import RendaConsultation from './RendaConsultation';
import { RendaResultType } from '../types';
import { parseRendaResponse } from '../utils/rendaParser';
import { checkDeviceLimit, incrementDeviceConsultations, getDeviceConsultationHistory } from '../utils/deviceFingerprint';

interface LayoutProps {
  onResultReady: (result: RendaResultType) => void;
}

const Layout = ({ onResultReady }: LayoutProps) => {
  const [deviceLimitInfo, setDeviceLimitInfo] = useState(() => checkDeviceLimit());

  useEffect(() => {
    // Check device limit on component mount
    const limitInfo = checkDeviceLimit();
    setDeviceLimitInfo(limitInfo);
    
    // Log device info for debugging
    const history = getDeviceConsultationHistory();
    console.log('🔍 Device consultation history:', history);
  }, []);

  const handleConsultation = async (formData: any, sessionId: string): Promise<RendaResultType> => {
    // Check device limit before making consultation
    const currentLimitInfo = checkDeviceLimit();
    
    if (currentLimitInfo.isLimited) {
      throw new Error('Limite de 10 consultas atingido para este dispositivo. Entre em contato pelo WhatsApp para continuar.');
    }

    try {
      console.log('🚀 Starting renda consultation for:', formData);
      console.log('🔒 Device ID:', currentLimitInfo.deviceId);
      
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
          sessionId: sessionId,
          deviceId: currentLimitInfo.deviceId // Include device ID in request
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

      // Increment device consultation count
      const newCount = incrementDeviceConsultations();
      
      // Update local state
      setDeviceLimitInfo({
        isLimited: newCount >= 10,
        consultationsUsed: newCount,
        deviceId: currentLimitInfo.deviceId
      });

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

  const consultationsRemaining = Math.max(0, 10 - deviceLimitInfo.consultationsUsed);

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
                <div className={`text-lg font-bold ${consultationsRemaining > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {consultationsRemaining}
                </div>
              </div>
              
              {deviceLimitInfo.isLimited && (
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

      {/* Device Limit Warning */}
      {deviceLimitInfo.isLimited && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600" />
              <div>
                <div className="font-semibold text-red-800">Limite de consultas atingido</div>
                <div className="text-sm text-red-700">
                  Este dispositivo já realizou 10 consultas. Entre em contato pelo WhatsApp para continuar.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <RendaConsultation 
          onConsultation={handleConsultation}
          consultationCount={deviceLimitInfo.consultationsUsed}
          isDeviceLimited={deviceLimitInfo.isLimited}
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
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-400">
              Device ID: {deviceLimitInfo.deviceId.slice(-8)}... | 
              Consultas: {deviceLimitInfo.consultationsUsed}/10
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;