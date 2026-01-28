export type DiagnosisResult = {
  id: string;

  crop_name: string;
  disease_name: string;

  confidence: number;
  is_healthy: boolean;
  needs_retry?: string | null;

  image_url: string;
  heatmap_url?: string | null;

  model_version: string;
  created_at: string;

  quality_metrics: {
    quality_score: number;
    blur_score: number;
    brightness: number;
    is_acceptable: boolean;
    issues: string[];
  };

  suggestions: string[];

  top_3_predictions: {
    class_name: string;
    crop_name: string;
    disease_name: string;
    confidence: number;
  }[];
};
