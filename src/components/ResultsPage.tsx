import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingUp, Building2, MapPin, DollarSign, Shield, Users, Award, Target, Zap, MessageCircle, Search, FileText } from 'lucide-react';
import { RendaResultType } from '../types';
import { formatCurrencyDisplay } from '../utils/currencyMask';

interface ResultsPageProps {
  result: RendaResultType | null;
}

const ResultsPage = ({ result }: ResultsPageProps) => {
  const navigate = useNavigate();

  if (!result) {
    navigate('/');
    return null;
  }

  const getAlertIcon = (nivel: string) => {
    const lowerNivel = nivel.toLowerCase();
    if (lowerNivel.includes('alto')) {
      return <AlertTriangle className="text-red-500" size={24} />;
    } else if (lowerNivel.includes('moderado')) {
      return <AlertTriangle className="text-yellow-500" size={24} />;
    } else if (lowerNivel.includes('baixo')) {
      return <Shield className="text-blue-500" size={24} />;
    } else {
      return <Shield className="text-green-500" size={24} />;
    }
  };

  const getAlertColor = (nivel: string) => {
    const lowerNivel = nivel.toLowerCase();
    if (lowerNivel.includes('alto')) {
      return 'bg-red-50 border-red-200 text-red-800';
    } else if (lowerNivel.includes('moderado')) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    } else if (lowerNivel.includes('baixo')) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    } else {
      return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getPorteIcon = (porte: string) => {
    switch (porte.toLowerCase()) {
      case 'grande':
        return <Building2 className="text-purple-600" size={20} />;
      case 'média':
        return <Building2 className="text-blue-600" size={20} />;
      default:
        return <Building2 className="text-gray-600" size={20} />;
    }
  };

  const getNivelIcon = (nivel: string) => {
    const lowerNivel = nivel.toLowerCase();
    if (lowerNivel.includes('diretoria')) return <Award className="text-purple-600" size={20} />;
    if (lowerNivel.includes('gestão')) return <Target className="text-blue-600" size={20} />;
    if (lowerNivel.includes('sênior')) return <Zap className="text-green-600" size={20} />;
    if (lowerNivel.includes('pleno')) return <TrendingUp className="text-orange-600" size={20} />;
    if (lowerNivel.includes('júnior')) return <Users className="text-blue-500" size={20} />;
    return <Users className="text-gray-500" size={20} />;
  };

  const handleNewConsultation = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleNewConsultation}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/logo-omni.svg" 
                    alt="Omni Logo" 
                    className="w-16 h-auto"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Resultado da Análise</h1>
                  <p className="text-sm text-gray-600">Renda Presumida - Detecção de Fraudes</p>
                </div>
              </div>
            </div>
            
            <a 
              href="https://wa.me/5511995736666" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} />
              Suporte WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header with analyzed data */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Análise Concluída</h2>
              <button
                onClick={handleNewConsultation}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Nova Consulta
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <div>
                  <div className="text-sm opacity-90">Cargo</div>
                  <div className="font-semibold">{result.cargo}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <div>
                  <div className="text-sm opacity-90">Empresa</div>
                  <div className="font-semibold">{result.empresa}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <div>
                  <div className="text-sm opacity-90">Localidade</div>
                  <div className="font-semibold">{result.localidade}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Data Display */}
          {result.inputData && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Dados da Consulta
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Cargo Informado</div>
                  <div className="text-lg font-semibold text-gray-800">{result.inputData.cargo}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Empresa Informada</div>
                  <div className="text-lg font-semibold text-gray-800">{result.inputData.empresa}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Localidade Informada</div>
                  <div className="text-lg font-semibold text-gray-800">{result.inputData.localidade}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Salário Declarado</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {formatCurrencyDisplay(result.inputData.salario_declarado)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Salary Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="text-green-600" size={24} />
              Análise Salarial
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Salário Mínimo</div>
                <div className="text-2xl font-bold text-green-800">{result.salario_estimado.min}</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Salário Médio</div>
                <div className="text-2xl font-bold text-blue-800">{result.salario_estimado.media}</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600 mb-1">Salário Máximo</div>
                <div className="text-2xl font-bold text-purple-800">{result.salario_estimado.max}</div>
              </div>
            </div>
          </div>

          {/* Professional Level and Company Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                {getNivelIcon(result.nivel)}
                Nível Profissional
              </h3>
              <div className="text-2xl font-bold text-gray-800">{result.nivel}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                {getPorteIcon(result.porte_empresa)}
                Porte da Empresa
              </h3>
              <div className="text-2xl font-bold text-gray-800">{result.porte_empresa}</div>
            </div>
          </div>

          {/* Fraud Alert */}
          <div className={`rounded-xl border p-6 ${getAlertColor(result.alerta_fraude)}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              {getAlertIcon(result.alerta_fraude)}
              Alerta de Fraude
            </h3>
            
            <div className="text-xl font-bold mb-2">
              Nível: {result.alerta_fraude}
            </div>
            
            {result.alerta_fraude.toLowerCase().includes('alto') && (
              <div className="text-sm">
                ⚠️ Salário declarado significativamente superior à média de mercado. Recomenda-se investigação adicional.
              </div>
            )}
            
            {result.alerta_fraude.toLowerCase().includes('moderado') && (
              <div className="text-sm">
                ⚡ Salário declarado acima da média. Verificação recomendada.
              </div>
            )}
            
            {result.alerta_fraude.toLowerCase().includes('baixo') && (
              <div className="text-sm">
                ✅ Salário declarado dentro da faixa esperada com pequena variação.
              </div>
            )}
            
            {result.alerta_fraude.toLowerCase().includes('nenhum') && (
              <div className="text-sm">
                ✅ Salário declarado compatível com a média de mercado.
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Aviso:</strong> Este resultado pertence a um protótipo da aplicação de Renda Presumida, e os valores podem ser inexatos ou estimados. Em breve haverá um desenvolvimento para aprimorar a Renda Presumida com controle antifraude do cliente Omni, com a inteligência artificial processando ainda mais precisos e exclusivos.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNewConsultation}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Search size={20} />
              Nova Consulta
            </button>
            
            <a
              href="https://wa.me/5511995736666"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <MessageCircle size={20} />
              Contato WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;