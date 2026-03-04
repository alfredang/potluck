import Stripe from 'stripe';

// HitPay configuration
const HITPAY_API_KEY = process.env.HITPAY_API_KEY || '';
const HITPAY_BASE_URL = 'https://api.hitpay.com/v1';

// Initialize Stripe (for reference/comparison)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

interface HitPayPaymentRequest {
  amount: number;
  currency: string;
  reference_id: string;
  description: string;
  callback_url?: string;
  redirect_url?: string;
}

interface HitPayRecurringPlan {
  name: string;
  amount: number;
  currency: string;
  frequency: 'weekly' | 'monthly' | 'yearly';
  reference_id: string;
  customer_email: string;
}

class HitPayService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = HITPAY_BASE_URL;
  }

  private async request(endpoint: string, method: string = 'GET', body?: object) {
    const headers = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HitPay API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Create a one-time payment request
  async createPaymentRequest(payment: HitPayPaymentRequest) {
    return this.request('/payment-requests', 'POST', {
      ...payment,
      currency: 'SGD',
    });
  }

  // Get payment request status
  async getPaymentStatus(paymentId: string) {
    return this.request(`/payment-requests/${paymentId}`, 'GET');
  }

  // Create a recurring payment plan (for subscriptions)
  async createRecurringPlan(plan: HitPayRecurringPlan) {
    return this.request('/recurring-payment-plans', 'POST', {
      ...plan,
      currency: 'SGD',
    });
  }

  // Get all recurring plans
  async getRecurringPlans() {
    return this.request('/recurring-payment-plans', 'GET');
  }

  // Activate a recurring plan for a customer
  async activateRecurringPlan(planId: string, customerEmail: string) {
    return this.request('/recurring-payment-plans/${planId}/activate', 'POST', {
      customer_email: customerEmail,
    });
  }

  // Get business details
  async getBusiness() {
    return this.request('/business', 'GET');
  }
}

// Export singleton instance
export const hitpayService = new HitPayService(HITPAY_API_KEY);

export default HitPayService;
