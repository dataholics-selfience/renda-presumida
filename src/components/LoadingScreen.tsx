import { useState, useEffect } from 'react';
import { Database, Shield, Search, Building2, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const LoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { 
      id: 0, 
      text: 'Conectando às bases de dados públicas', 
      icon: Database,
      delay: 300 
    },
    { 
      id: 1, 
      text: 'Analisando dados salariais do cargo', 
      icon: TrendingUp,
      delay: 400 
    },
    { 
      id: 2, 
      text: 'Verificando porte da empresa', 
      icon: Building2,
      delay: 350 
    },
    { 
      id: 3, 
      text: 'Comparando com perfis similares', 
      icon: Users,
      delay: 500 
    },
    { 
      id: 4, 
      text: 'Executando algoritmos de detecção', 
      icon: Search,
      delay: 600 
    },
    { 
      id: 5, 
      text: 'Calculando nível de risco de fraude', 
      icon: AlertTriangle,
      delay: 450 
    },
    { 
      id: 6, 
      text: 'Gerando relatório de análise', 
      icon: Shield,
      delay: 700 
    }
  ];

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Wait for the step delay
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
        
        // Mark as completed immediately
        setCompletedSteps(prev => [...prev, i]);
      }
    };

    processSteps();
  }, []);

  const getStepState = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'processing';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 flex items-center justify-center z-50">
      <div className="text-center text-white max-w-lg mx-auto px-6">
        {/* Main Loading Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 border-3 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-3 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
              
              {/* Inner pulsing core */}
              <div className="absolute inset-2 bg-white/10 rounded-full flex items-center justify-center">
                <Database size={28} className="text-white animate-pulse" style={{ animationDuration: '0.6s' }} />
              </div>
              
              {/* Fast orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-white/70 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Consultando Bases Públicas
          </h1>
          <p className="text-lg text-white/90">
            para checar a Renda Presumida
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-2 mb-6">
          {steps.map((step) => {
            const state = getStepState(step.id);
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  state === 'completed' 
                    ? 'bg-white/20 border border-white/30' 
                    : state === 'processing'
                    ? 'bg-white/15 border border-white/40 scale-105'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 transition-all duration-150 ${
                  state === 'processing' ? 'animate-pulse scale-110' : ''
                }`}>
                  <Icon 
                    size={20} 
                    className={`${
                      state === 'completed' 
                        ? 'text-green-300' 
                        : state === 'processing'
                        ? 'text-white'
                        : 'text-white/50'
                    }`} 
                  />
                </div>
                
                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {state === 'completed' ? (
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  ) : state === 'processing' ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '0.5s' }}></div>
                  ) : (
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  )}
                </div>
                
                {/* Text */}
                <div className={`flex-1 text-left text-sm transition-all duration-150 ${
                  state === 'completed' 
                    ? 'font-bold text-white' 
                    : state === 'processing'
                    ? 'font-bold text-white'
                    : 'font-normal text-white/70'
                }`}>
                  {step.text}
                  {state === 'processing' && (
                    <span className="inline-block ml-1">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.1s' }}>.</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    </span>
                  )}
                  {state === 'completed' && (
                    <span className="ml-2 text-green-300 font-bold">✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-300 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${((completedSteps.length) / steps.length) * 100}%` 
            }}
          ></div>
        </div>
        
        {/* Progress Text */}
        <div className="text-white/80 text-xs">
          {completedSteps.length} de {steps.length} verificações concluídas
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;