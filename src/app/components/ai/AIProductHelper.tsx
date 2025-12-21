import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader, Wand2 } from 'lucide-react';
import { generateProductImage, enhanceProductDescription } from '../../services/ai';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface AIProductHelperProps {
  productName: string;
  productDescription?: string;
  productCategory?: string;
  price?: number;
  onImageGenerated?: (imageUrl: string) => void;
  onDescriptionEnhanced?: (description: string) => void;
}

export function AIProductHelper({
  productName,
  productDescription,
  productCategory,
  price,
  onImageGenerated,
  onDescriptionEnhanced,
}: AIProductHelperProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [enhancingDescription, setEnhancingDescription] = useState(false);

  const handleGenerateImage = async () => {
    if (!productName) {
      toast.error('Please enter a product name first');
      return;
    }

    setGeneratingImage(true);
    try {
      const { imageUrl } = await generateProductImage(
        productName,
        productDescription,
        productCategory
      );
      toast.success('AI image generated successfully!');
      if (onImageGenerated) {
        onImageGenerated(imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!productName) {
      toast.error('Please enter a product name first');
      return;
    }

    setEnhancingDescription(true);
    try {
      const enhancedDescription = await enhanceProductDescription(
        productName,
        productDescription,
        productCategory,
        price
      );
      toast.success('Description enhanced by AI!');
      if (onDescriptionEnhanced) {
        onDescriptionEnhanced(enhancedDescription);
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to enhance description');
    } finally {
      setEnhancingDescription(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-[#0F4C81]" />
        <span className="text-sm font-medium text-[#0F4C81]">AI Assistant</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerateImage}
          disabled={generatingImage || !productName}
          className="border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5 disabled:opacity-50"
        >
          {generatingImage ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleEnhanceDescription}
          disabled={enhancingDescription || !productName}
          className="border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5 disabled:opacity-50"
        >
          {enhancingDescription ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Enhance Description
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        AI will help generate product images and improve descriptions based on your input.
      </p>
    </div>
  );
}
