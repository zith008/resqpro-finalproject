import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

export interface SafetyScanResult {
  id?: string;
  user_id?: string;
  image_url?: string;
  risk_level: 'low' | 'medium' | 'high';
  summary: string;
  suggestions: string[];
  analysis_data?: any;
  location_name?: string;
  created_at?: string;
  updated_at?: string;
}

class SafetyScanService {
  /**
   * Upload image to Supabase Storage
   */
  async uploadScanImage(imageUri: string, userId: string): Promise<string> {
    try {
      // Read the image file
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `safety-scans/${userId}/${timestamp}.jpg`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('safety-scans')
        .upload(filename, imageData, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('safety-scans')
        .getPublicUrl(filename);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading scan image:', error);
      throw error;
    }
  }

  /**
   * Save safety scan result to database
   */
  async saveScanResult(
    result: Omit<SafetyScanResult, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    imageUri?: string
  ): Promise<SafetyScanResult> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      let imageUrl: string | undefined;

      // Upload image if provided
      if (imageUri) {
        imageUrl = await this.uploadScanImage(imageUri, user.id);
      }

      // Save to database
      const { data, error } = await supabase
        .from('safety_scan_results')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          risk_level: result.risk_level,
          summary: result.summary,
          suggestions: result.suggestions,
          analysis_data: result.analysis_data,
          location_name: result.location_name,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save scan result: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error saving scan result:', error);
      throw error;
    }
  }

  /**
   * Get user's safety scan history
   */
  async getScanHistory(limit: number = 20): Promise<SafetyScanResult[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('safety_scan_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch scan history: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching scan history:', error);
      throw error;
    }
  }

  /**
   * Get scan result by ID
   */
  async getScanResult(id: string): Promise<SafetyScanResult | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('safety_scan_results')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch scan result: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching scan result:', error);
      throw error;
    }
  }

  /**
   * Delete scan result
   */
  async deleteScanResult(id: string): Promise<void> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('safety_scan_results')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to delete scan result: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting scan result:', error);
      throw error;
    }
  }

  /**
   * Get scan statistics for user
   */
  async getScanStatistics(): Promise<{
    totalScans: number;
    highRiskScans: number;
    mediumRiskScans: number;
    lowRiskScans: number;
    lastScanDate?: string;
  }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('safety_scan_results')
        .select('risk_level, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch scan statistics: ${error.message}`);
      }

      const scans = data || [];
      const totalScans = scans.length;
      const highRiskScans = scans.filter(s => s.risk_level === 'high').length;
      const mediumRiskScans = scans.filter(s => s.risk_level === 'medium').length;
      const lowRiskScans = scans.filter(s => s.risk_level === 'low').length;
      const lastScanDate = scans.length > 0 ? scans[0].created_at : undefined;

      return {
        totalScans,
        highRiskScans,
        mediumRiskScans,
        lowRiskScans,
        lastScanDate,
      };
    } catch (error) {
      console.error('Error fetching scan statistics:', error);
      throw error;
    }
  }
}

export const safetyScanService = new SafetyScanService();
