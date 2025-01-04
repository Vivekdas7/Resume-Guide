import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { ResumeWritingGuide } from './pages/guides/ResumeWritingGuide';
import { CoverLetterBuilder } from './pages/tools/CoverLetterBuilder';
import { CareerBlog } from './pages/blog/CareerBlog';
import { CareerAdvice } from './pages/resources/CareerAdvice';
import { InterviewTips } from './pages/resources/InterviewTips';
import { JobSearchStrategy } from './pages/resources/JobSearchStrategy';
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resume-guide" element={<ResumeWritingGuide />} />
          <Route path="/cover-letter" element={<CoverLetterBuilder />} />
          <Route path="/blog" element={<CareerBlog />} />
          <Route path="/career-advice" element={<CareerAdvice />} />
          <Route path="/interview-tips" element={<InterviewTips />} />
          <Route path="/job-search" element={<JobSearchStrategy />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
