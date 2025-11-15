export class ImageSimilarity {
  private static async imageToCanvas(file: File, size: number = 64): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private static getImageData(canvas: HTMLCanvasElement): Uint8ClampedArray {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  }

  private static calculateHistogram(imageData: Uint8ClampedArray): number[] {
    const histogram = new Array(256).fill(0);

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
      histogram[gray]++;
    }

    const total = imageData.length / 4;
    return histogram.map(count => count / total);
  }

  private static compareHistograms(hist1: number[], hist2: number[]): number {
    let similarity = 0;
    for (let i = 0; i < hist1.length; i++) {
      similarity += Math.min(hist1[i], hist2[i]);
    }
    return similarity;
  }

  static async compareSimilarity(image1: File, image2: File): Promise<number> {
    try {
      const [canvas1, canvas2] = await Promise.all([
        this.imageToCanvas(image1),
        this.imageToCanvas(image2),
      ]);

      const imageData1 = this.getImageData(canvas1);
      const imageData2 = this.getImageData(canvas2);

      const hist1 = this.calculateHistogram(imageData1);
      const hist2 = this.calculateHistogram(imageData2);

      const similarity = this.compareHistograms(hist1, hist2);

      //console.log('Image similarity score:', (similarity * 100).toFixed(1) + '%');

      return similarity;
    } catch (error) {
      console.error('Failed to compare images:', error);
      return 0;
    }
  }

  static getSimilarityLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.85) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }

  static getSimilarityMessage(score: number): string {
    const level = this.getSimilarityLevel(score);

    if (level === 'high') {
      return 'Images appear highly similar - likely the same vehicle';
    } else if (level === 'medium') {
      return 'Cannot automatically verify vehicle identity - please manually confirm both images are of the same vehicle';
    } else {
      return 'Images appear significantly different - please verify you uploaded the correct vehicle images';
    }
  }
}
