import React from 'react';
import { X, Key, Save, Check, CreditCard, Building, ShieldCheck } from 'lucide-react';
import { ApiSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  setSettings: React.Dispatch<React.SetStateAction<ApiSettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings
}) => {
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  if (!isOpen) return null;

  const bankDetails = settings.bankDetails || {
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    stripePaymentLink: ''
  };

  const handleBankChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      bankDetails: {
        ...bankDetails,
        [field]: value
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', borderRadius: '20px', background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={22} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                System Credentials & Bank Payout Profile
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Manage API keys and save your bank details for direct client payouts.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Bank & Payment Profile Section */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Building size={18} color="#34d399" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                Bank Account & Payout Information (INR / USD Direct Deposit)
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Account Holder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sabyasachi Mohanty"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleBankChange('accountHolderName', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank / ICICI Bank"
                  value={bankDetails.bankName}
                  onChange={(e) => handleBankChange('bankName', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 50100012345678"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>IFSC Code / SWIFT</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0000123"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleBankChange('ifscCode', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>UPI ID (Google Pay / PhonePe / Paytm)</label>
                <input
                  type="text"
                  placeholder="e.g. name@okaxis"
                  value={bankDetails.upiId}
                  onChange={(e) => handleBankChange('upiId', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Stripe / Razorpay Payment Link</label>
                <input
                  type="text"
                  placeholder="https://buy.stripe.com/..."
                  value={bankDetails.stripePaymentLink}
                  onChange={(e) => handleBankChange('stripePaymentLink', e.target.value)}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '8px' }}>
              🔒 Bank details are encrypted locally and used to generate client payment invoices & direct client billing.
            </p>
          </div>

          {/* OpenAI Key */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              OpenAI / Anthropic API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={settings.openaiApiKey}
              onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
            />
          </div>

          {/* Gemini Key */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={settings.geminiApiKey}
              onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Min. Lead Budget Filter ($)
              </label>
              <input
                type="number"
                value={settings.minLeadBudget}
                onChange={(e) => setSettings({ ...settings, minLeadBudget: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Min. Match Score Threshold (%)
              </label>
              <input
                type="number"
                value={settings.minMatchScore}
                onChange={(e) => setSettings({ ...settings, minMatchScore: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Save Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-emerald">
              {savedSuccess ? <Check size={16} /> : <Save size={16} />}
              {savedSuccess ? 'Bank Details & Settings Saved!' : 'Save Profile & Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
