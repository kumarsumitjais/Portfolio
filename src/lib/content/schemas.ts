import { z } from "zod";

export const skillSchema = z.object({
  languages: z.array(z.string()),
  databases: z.array(z.string()),
  tools: z.array(z.string()),
  libraries: z.array(z.string()),
  generativeAi: z.array(z.string()),
  machineLearning: z.array(z.string()),
  dataAnalysis: z.array(z.string()),
  soft: z.array(z.string()),
});

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  start: z.string(),
  end: z.string().optional(),
  bullets: z.array(z.string()),
  stack: z.array(z.string()),
});

export const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  dates: z.string(),
  gpa: z.string().optional(),
  coursework: z.array(z.string()),
});

export const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  credentialUrl: z.string(),
  skills: z.array(z.string()),
});

export const achievementSchema = z.object({
  title: z.string(),
  event: z.string(),
  date: z.string(),
});
