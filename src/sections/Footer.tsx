import { useState } from 'react';
import { Instagram, MessageCircle, X } from 'lucide-react';

// Modal Component
function LegalModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-sm max-w-none text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  return (
    <>
      {/* Minimal Footer */}
      <footer id="contato" className="py-20 bg-white">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://instagram.com/clinicadoiphone"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-brand-blue hover:bg-brand-blue/5 transition-all group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
              </a>
              <a
                href="https://wa.me/5581999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-whatsapp hover:bg-whatsapp/5 transition-all group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-whatsapp transition-colors" />
              </a>
            </div>

            {/* Brand */}
            <div className="flex flex-col items-center mt-8">
              <img
                src="/images/logo-clinica.jpg"
                alt="Clinica do iPhone"
                className="h-14 w-14 rounded-full object-cover mb-3"
              />
              <p className="text-sm font-extralight text-gray-400">
                Clinica do <span className="text-brand-blue">iPhone</span>
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Abreu e Lima, PE
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Footer */}
      <div className="py-8 bg-apple-gray border-t border-gray-200">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            {/* Disclaimer */}
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              A Clínica do iPhone é uma assistência técnica e loja independente.
              Não somos afiliados à Apple Inc. &quot;iPhone&quot; é marca registrada da
              Apple Inc.
            </p>

            {/* Legal Links */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button
                onClick={() => setPrivacyModalOpen(true)}
                className="text-xs text-gray-400 hover:text-brand-blue transition-colors underline underline-offset-2"
              >
                Política de Privacidade
              </button>
              <button
                onClick={() => setTermsModalOpen(true)}
                className="text-xs text-gray-400 hover:text-brand-blue transition-colors underline underline-offset-2"
              >
                Termos de Segurança (LGPD)
              </button>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-300 text-center mt-6">
              © {new Date().getFullYear()} Clínica do iPhone. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      <LegalModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Política de Privacidade"
      >
        <div className="space-y-4">
          <p>
            <strong>1. Coleta de Dados</strong>
            <br />
            A Clínica do iPhone coleta apenas os dados necessários para prestação
            de serviços, incluindo nome, telefone e e-mail para contato.
          </p>
          <p>
            <strong>2. Uso das Informações</strong>
            <br />
            As informações coletadas são utilizadas exclusivamente para:
            - Comunicação sobre serviços solicitados
            - Envio de orçamentos
            - Acompanhamento de reparos
            - Contato sobre produtos adquiridos
          </p>
          <p>
            <strong>3. Proteção de Dados</strong>
            <br />
            Utilizamos medidas de segurança adequadas para proteger suas
            informações contra acesso não autorizado, alteração ou divulgação.
          </p>
          <p>
            <strong>4. Compartilhamento</strong>
            <br />
            Não vendemos, trocamos ou transferimos suas informações pessoais para
            terceiros sem seu consentimento expresso.
          </p>
          <p>
            <strong>5. Seus Direitos</strong>
            <br />
            Você tem o direito de acessar, corrigir ou solicitar a exclusão de
            seus dados pessoais a qualquer momento.
          </p>
        </div>
      </LegalModal>

      {/* Terms Modal */}
      <LegalModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Termos de Segurança (LGPD)"
      >
        <div className="space-y-4">
          <p>
            <strong>1. Conformidade com a LGPD</strong>
            <br />
            A Clínica do iPhone está em conformidade com a Lei Geral de Proteção
            de Dados (Lei nº 13.709/2018), respeitando todos os direitos dos
            titulares de dados.
          </p>
          <p>
            <strong>2. Base Legal</strong>
            <br />
            O tratamento de dados pessoais é realizado com base no consentimento
            do titular ou na execução de contrato/serviço solicitado.
          </p>
          <p>
            <strong>3. Direitos do Titular</strong>
            <br />
            De acordo com a LGPD, você tem direito a:
            - Confirmar a existência de tratamento de dados
            - Acessar seus dados
            - Corrigir dados incompletos ou desatualizados
            - Solicitar anonimização, bloqueio ou eliminação de dados
            - Portabilidade dos dados
            - Revogar consentimento
          </p>
          <p>
            <strong>4. Segurança da Informação</strong>
            <br />
            Implementamos controles técnicos e administrativos para garantir a
            segurança dos dados pessoais contra incidentes.
          </p>
          <p>
            <strong>5. Contato do DPO</strong>
            <br />
            Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento
            de dados, entre em contato através do e-mail:
            privacidade@clinicadoiphone.com.br
          </p>
        </div>
      </LegalModal>
    </>
  );
}
