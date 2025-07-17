import { Post } from "@/interfaces/post";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getPostSlugs(): Promise<string[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }

  return posts?.map(post => post.slug) || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 如果使用规范化表结构（posts + authors）
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(name, picture)
    `)
    .eq('slug', slug)
    .single();

  // 如果使用单表结构，改用这个查询：
  // const { data: post, error } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .eq('slug', slug)
  //   .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!post) return null;

  // 转换数据格式以匹配Post接口
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    coverImage: post.cover_image,
    author: post.author || { name: post.author_name, picture: post.author_picture },
    excerpt: post.excerpt,
    ogImage: {
      url: post.og_image_url
    },
    content: post.content,
    preview: post.preview || false
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 如果使用规范化表结构（posts + authors）
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(name, picture)
    `)
    .order('date', { ascending: false });

  // 如果使用单表结构，改用这个查询：
  // const { data: posts, error } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  if (!posts) return [];

  // 转换数据格式以匹配Post接口
  return posts.map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    coverImage: post.cover_image,
    author: post.author || { name: post.author_name, picture: post.author_picture },
    excerpt: post.excerpt,
    ogImage: {
      url: post.og_image_url
    },
    content: post.content,
    preview: post.preview || false
  }));
}

// 可选：添加创建新文章的函数
export async function createPost(postData: Omit<Post, 'slug'>): Promise<Post | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 生成slug（简单实现）
  const slug = postData.title.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      slug,
      title: postData.title,
      date: postData.date,
      cover_image: postData.coverImage,
      excerpt: postData.excerpt,
      og_image_url: postData.ogImage.url,
      content: postData.content,
      preview: postData.preview || false,
      // 如果使用单表结构，添加：
      // author_name: postData.author.name,
      // author_picture: postData.author.picture,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  return data ? await getPostBySlug(slug) : null;
}
