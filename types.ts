
export interface Slide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface CarouselProps {
  slides: Slide[];
}
