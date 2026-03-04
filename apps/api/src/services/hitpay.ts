import { config } from '../config';

const HITPAY_API_KEY = config.hitpayApiKey;
const HITPAY_BASE_URL = 'https://api.hitpay.com/v1';

interface HitPayRecurringPlan {
  id?: string;
  name: string;
  amount: number;
  currency?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  reference_id: string;
  customer_email?: string;
  payment_methods?: string[];
}

interface HitPayPaymentRequest {
  id?: string;
  amount: number;
  currency?: string;
  reference_id: string;
  description?: string;
  status?: string;
  url?: string;
}

export class HitPayService {
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

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HitPay API Error (${response.status}): ${error}`);
      }

      return response.json();
    } catch (error: any) {
      console.error('HitPay request failed:', error.message);
      throw error;
    }
  }

  // ========================================
  // SUBSCRIPTION METHODS
  // ========================================

  /**
   * Get all recurring payment plans
   * API: GET /recurring-payment-plans
   */
  async getRecurringPlans(): Promise<HitPayRecurringPlan[]> {
    return this.request('/recurring-payment-plans', 'GET');
  }

  /**
   * Create a new recurring payment plan
   * API: POST /recurring-payment-plans
   */
  async createRecurringPlan(plan: HitPayRecurringPlan): Promise<any> {
    return this.request('/recurring-payment-plans', 'POST', {
      name: plan.name,
      amount: plan.amount,
      currency: plan.currency || 'SGD',
      frequency: plan.frequency,
      reference_id: plan.reference_id,
      payment_methods: plan.payment_methods || ['card', 'paynow'],
    });
  }

  /**
   * Get a specific recurring plan by ID
   * API: GET /recurring-payment-plans/{plan_id}
   */
  async getRecurringPlan(planId: string): Promise<HitPayRecurringPlan> {
    return this.request(`/recurring-payment-plans/${planId}`, 'GET');
  }

  /**
   * Activate/subscribe a customer to a recurring plan
   * API: POST /recurring-payment-plans/{plan_id}/activate
   */
  async activateRecurringPlan(planId: string, customerEmail: string, referenceId: string): Promise<any> {
    return this.request(`/recurring-payment-plans/${planId}/activate`, 'POST', {
      customer_email: customerEmail,
      reference_id: referenceId,
    });
  }

  /**
   * Get all subscriptions (customers on plans)
   * API: GET /recurring-payment-plans/{plan_id}/subscriptions
   */
  async getPlanSubscriptions(planId: string): Promise<any[]> {
    return this.request(`/recurring-payment-plans/${planId}/subscriptions`, 'GET');
  }

  /**
   * Cancel a subscription
   * API: DELETE /recurring-payment-plans/{plan_id}/subscriptions/{subscription_id}
   */
  async cancelSubscription(planId: string, subscriptionId: string): Promise<any> {
    return this.request(`/recurring-payment-plans/${planId}/subscriptions/${subscriptionId}`, 'DELETE');
  }

  // ========================================
  // PAYMENT REQUEST METHODS
  // ========================================

  /**
   * Create a one-time payment request
   * API: POST /payment-requests
   */
  async createPaymentRequest(payment: HitPayPaymentRequest): Promise<HitPayPaymentRequest> {
    return this.request('/payment-requests', 'POST', {
      amount: payment.amount,
      currency: payment.currency || 'SGD',
      reference_id: payment.reference_id,
      description: payment.description,
      payment_methods: ['card', 'paynow'],
    });
  }

  /**
   * Get payment request status
   * API: GET /payment-requests/{payment_id}
   */
  async getPaymentStatus(paymentId: string): Promise<HitPayPaymentRequest> {
    return this.request(`/payment-requests/${paymentId}`, 'GET');
  }

  /**
   * Get business details
   * API: GET /business
   */
  async getBusiness(): Promise<any> {
    return this.request('/business', 'GET');
  }
}

// Export singleton
export const hitpayService = new HitPayService(HITPAY_API_KEY);
export default HitPayService;
