import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, MessageCircle, Briefcase, Shield } from 'lucide-react';
import { RendaResultType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import LoadingScreen from './LoadingScreen';

interface RendaConsultationProps {
  onConsultation: (formData: any, sessionId: string) => Promise<RendaResultType>;
  consultationCount: number;
  isDeviceLimited: boolean;
}

const RendaConsultation = ({ onConsultation, consultationCount, isDeviceLimited }: RendaConsultationProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cargo: '',
    empresa: '',
    localidade: '',
    salario_declarado: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => uuidv4().replace(/-/g, '').substring(0, 24));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cargo.trim() || !formData.empresa.trim() || !formData.localidade.trim() || isLoading || isDeviceLimited) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 Iniciando consulta de renda para:', formData);
      const resultado = await onConsultation(formData, sessionId);
      console.log('✅ Resultado recebido:', resultado);
      
      // Navigate to results page
      navigate('/results');
      
    } catch (err) {
      console.error('❌ Erro na consulta:', err);
      setError(err instanceof Error ? err.message : 'Erro ao consultar renda presumida');
    } finally {
      setIsLoading(false);
    }
  };

  // Show full-screen loading animation
  if (isLoading) {
    return <LoadingScreen />;
  }

  const consultationsRemaining = Math.max(0, 10 - consultationCount);

  return (
    <div className="space-y-8">
      {/* Consultation Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nova Consulta de Renda</h2>
          <p className="text-gray-600">Preencha os dados para análise de renda presumida e detecção de fraudes</p>
          
          {/* Consultation Counter */}
          <div className="mt-4 flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              consultationsRemaining > 3 
                ? 'bg-green-100 text-green-800' 
                : consultationsRemaining > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <Shield size={16} />
              {consultationsRemaining} consultas restantes
            </div>
            
            {consultationsRemaining <= 3 && consultationsRemaining > 0 && (
              <div className="text-sm text-yellow-600">
                ⚠️ Poucas consultas restantes
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Device Limit Warning */}
          {isDeviceLimited && (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-red-600" />
                <h3 className="text-lg font-bold text-red-800">Limite de Consultas Atingido</h3>
              </div>
              <p className="text-red-700 mb-4">
                Este dispositivo já realizou 10 consultas. O sistema detectou que você atingiu o limite máximo 
                de consultas gratuitas. Para continuar usando a ferramenta, entre em contato conosco pelo WhatsApp.
              </p>
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                <div className="text-sm text-red-800">
                  <strong>🔒 Sistema de Proteção Ativo:</strong><br/>
                  • Identificação por dispositivo<br/>
                  • Limite de 10 consultas por máquina<br/>
                  • Proteção contra uso excessivo
                </div>
              </div>
              <a
                href="https://wa.me/5511995736666"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <MessageCircle size={20} />
                Contatar via WhatsApp
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo *
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Ex: Desenvolvedor Full Stack, Analista de Marketing..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDeviceLimited 
                      ? 'border-red-300 bg-red-50 text-red-500 placeholder-red-400 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading || isDeviceLimited}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa *
                </label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Ex: Google, Petrobras, Magazine Luiza..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDeviceLimited 
                      ? 'border-red-300 bg-red-50 text-red-500 placeholder-red-400 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading || isDeviceLimited}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localidade (CEP ou Cidade/Estado) *
                </label>
                <input
                  type="text"
                  name="localidade"
                  value={formData.localidade}
                  onChange={handleChange}
                  placeholder="Ex: 01310-100, São Paulo/SP, Rio de Janeiro/RJ..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDeviceLimited 
                      ? 'border-red-300 bg-red-50 text-red-500 placeholder-red-400 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading || isDeviceLimited}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salário Declarado (opcional)
                </label>
                <input
                  type="text"
                  name="salario_declarado"
                  value={formData.salario_declarado}
                  onChange={handleChange}
                  placeholder="Ex: R$ 8.000,00"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDeviceLimited 
                      ? 'border-red-300 bg-red-50 text-red-500 placeholder-red-400 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading || isDeviceLimited}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.cargo.trim() || !formData.empresa.trim() || !formData.localidade.trim() || isLoading || isDeviceLimited}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isDeviceLimited
                  ? 'bg-red-400 text-white cursor-not-allowed opacity-50'
                  : !formData.cargo.trim() || !formData.empresa.trim() || !formData.localidade.trim() || isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isDeviceLimited ? (
                <>
                  <AlertTriangle size={20} />
                  Limite Atingido - Dispositivo Bloqueado
                </>
              ) : (
                <>
                  <Search size={20} />
                  Analisar Renda ({consultationsRemaining} restantes)
                </>
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RendaConsultation;