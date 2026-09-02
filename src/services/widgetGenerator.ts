import { ClientWidgetConfig } from '../types';

export const INITIAL_WIDGETS: ClientWidgetConfig[] = [
  {
    id: 'wid-301',
    clientName: 'Apex Real Estate Ventures',
    businessNiche: 'Real Estate & Property',
    primaryColor: '#10b981',
    welcomeMessage: '👋 Looking for your dream property or selling your home? I can estimate your property value in 60 seconds!',
    autoLeadQualificationQuestions: [
      'Are you buying or selling a property?',
      'What is your target budget or expected listing price?',
      'What is your preferred contact phone or email?'
    ],
    monthlySubscriptionPrice: 149,
    activeLeadsCaptured: 42,
    monthlyRecurringRevenue: 149,
    status: 'active',
    embedScriptCode: `<script src="https://cdn.revenueagenthub.com/v1/widget.js" data-client-id="wid-301" data-primary-color="#10b981" async></script>`
  },
  {
    id: 'wid-302',
    clientName: 'Boutique Law Firm Partner',
    businessNiche: 'Legal Services & Claims',
    primaryColor: '#6366f1',
    welcomeMessage: 'Hello! Need a legal consultation or case evaluation? Connect with our attorney team 24/7.',
    autoLeadQualificationQuestions: [
      'What type of legal service do you need (Corporate, Injury, Estate)?',
      'How soon do you require an attorney consultation?',
      'Please leave your contact details for an urgent call-back.'
    ],
    monthlySubscriptionPrice: 199,
    activeLeadsCaptured: 68,
    monthlyRecurringRevenue: 199,
    status: 'active',
    embedScriptCode: `<script src="https://cdn.revenueagenthub.com/v1/widget.js" data-client-id="wid-302" data-primary-color="#6366f1" async></script>`
  }
];

export function createNewClientWidget(
  clientName: string,
  businessNiche: string,
  primaryColor: string,
  monthlySubscriptionPrice: number = 99
): ClientWidgetConfig {
  const id = `wid-${Date.now()}`;
  const scriptCode = `<script src="https://cdn.revenueagenthub.com/v1/widget.js" data-client-id="${id}" data-primary-color="${primaryColor}" async></script>`;

  return {
    id,
    clientName,
    businessNiche,
    primaryColor,
    welcomeMessage: `Hi there! Welcome to ${clientName}. How can I assist you today?`,
    autoLeadQualificationQuestions: [
      'What service or product are you interested in?',
      'What is your expected timeline?',
      'Where should we email your custom quote?'
    ],
    monthlySubscriptionPrice,
    activeLeadsCaptured: 0,
    monthlyRecurringRevenue: monthlySubscriptionPrice,
    status: 'active',
    embedScriptCode: scriptCode
  };
}
