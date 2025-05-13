import { PageHeader } from '@/components/shared/page-header';
import { SentimentAnalysisTool } from '@/components/dashboard/sentiment-analysis-tool';
import { ShieldCheck } from 'lucide-react';

export default function SentimentAnalysisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Sentiment Analysis"
        description="Analyze candidate responses for sentiment and communication effectiveness."
        icon={ShieldCheck}
      />
      <SentimentAnalysisTool />
    </div>
  );
}
