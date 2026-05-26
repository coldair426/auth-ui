'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PolicyMeta } from '@/types/consent';

const CONTENT_DIR = path.join(process.cwd(), 'content/policies');

export async function getAllPolicyMetas(): Promise<PolicyMeta[]> {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  
  const slugs = fs.readdirSync(CONTENT_DIR);
  const metas: PolicyMeta[] = [];

  for (const slug of slugs) {
    const dirPath = path.join(CONTENT_DIR, slug);
    if (fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.mdx'))
        .sort()
        .reverse();
      
      if (files.length > 0) {
        const filePath = path.join(dirPath, files[0]);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        
        metas.push({
          ...data,
          slug,
        } as PolicyMeta);
      }
    }
  }

  return metas;
}

export async function getPolicyBySlug(slug: string, version?: string): Promise<{ meta: PolicyMeta; content: string }> {
  const dirPath = path.join(CONTENT_DIR, slug);
  let targetFile = '';

  if (version) {
    targetFile = `${version}.mdx`;
  } else {
    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.mdx'))
      .sort()
      .reverse();
    targetFile = files[0];
  }

  const filePath = path.join(dirPath, targetFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Policy not found: ${slug} (${version || 'latest'})`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    meta: {
      ...data,
      slug,
    } as PolicyMeta,
    content,
  };
}
