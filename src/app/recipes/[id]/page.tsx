import { notFound } from 'next/navigation';
import Link from 'next/link';
import { recipes } from '@/data/recipes';
import RecipeDetailClient from './RecipeDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return recipes.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const recipe = recipes.find((r) => r.id === Number(id));
  if (!recipe) return { title: 'レシピが見つかりません' };
  return { title: `${recipe.name} | フリッジレシピ` };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = recipes.find((r) => r.id === Number(id));
  if (!recipe) notFound();

  return <RecipeDetailClient recipe={recipe} />;
}
