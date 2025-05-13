
"use client";

import { ExamInterface } from '@/components/exam/exam-interface';
import type { TestPaper, TestQuestion } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Mock Test Data - In a real app, this would be fetched from a backend
const mockTestPapers: Record<string, TestPaper> = {
  'exam_2': { // Corresponds to Microsoft Exam (id '2' from dashboard)
    id: 'exam_2',
    name: 'Microsoft Software Engineer Technical MCQs',
    duration: 45,
    durationUnit: 'minutes',
    formats: ['MCQ'],
    questions: [
      { id: 'q2_1', text: 'Which data structure is typically used to implement a LIFO (Last-In, First-Out) behavior?', type: 'MCQ', options: ['Queue', 'Stack', 'Heap', 'Linked List'], correctAnswer: 'Stack' },
      { id: 'q2_2', text: 'What is the time complexity of a binary search algorithm on a sorted array of N elements?', type: 'MCQ', options: ['O(N)', 'O(log N)', 'O(N log N)', 'O(N^2)'], correctAnswer: 'O(log N)' },
      { id: 'q2_3', text: 'Which of the following is NOT a principle of Object-Oriented Programming?', type: 'MCQ', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Decomposition'], correctAnswer: 'Decomposition' },
      { id: 'q2_4', text: 'In SQL, which keyword is used to sort the result-set?', type: 'MCQ', options: ['SORT BY', 'ORDER BY', 'GROUP BY', 'ARRANGE BY'], correctAnswer: 'ORDER BY' },
    ],
    status: 'Published',
  },
  'exam_3': { // Corresponds to Amazon Data Analyst Test (id '3' from dashboard)
    id: 'exam_3',
    name: 'Amazon Data Analyst Coding Test',
    duration: 90,
    durationUnit: 'minutes',
    formats: ['Coding'],
    questions: [
      { id: 'q3_1', text: 'Write a SQL query to find the second highest salary.', type: 'Coding', language: 'python', defaultCode: 'SELECT MAX(Salary) FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee);' },
      { id: 'q3_2', text: 'Implement a function to calculate the moving average of a list of numbers.', type: 'Coding', language: 'python', defaultCode: 'def moving_average(data, window_size):\n  # Your code here\n  pass' },
    ],
    status: 'Published',
  },
  'mock_exam_5': { // Corresponds to Facebook Mock Technical Interview (id '5' from dashboard - treated as an exam here)
    id: 'mock_exam_5',
    name: 'Facebook Mock Technical Coding Session',
    duration: 60,
    durationUnit: 'minutes',
    formats: ['Coding'],
    questions: [
      { id: 'q5_1', text: 'Given an array of integers, find the two numbers such that they add up to a specific target number. You may assume that each input would have exactly one solution, and you may not use the same element twice.', type: 'Coding', language: 'python', defaultCode: 'def two_sum(nums, target):\n    # Your code here\n    pass' },
      { id: 'q5_2', text: 'Implement a basic LRU Cache.', type: 'Coding', language: 'javascript', defaultCode: 'class LRUCache {\n    constructor(capacity) {\n        // Your code here\n    }\n\n    get(key) {\n        // Your code here\n    }\n\n    put(key, value) {\n        // Your code here\n    }\n}' },
    ],
    status: 'Published',
  },
   // Add more mock test papers as needed, matching IDs from candidate dashboard items
   'default_exam': { // Fallback test paper
    id: 'default_exam',
    name: 'Sample Exam Paper',
    duration: 30,
    durationUnit: 'minutes',
    formats: ['MCQ'],
    questions: [
      { id: 'def_q1', text: 'This is a sample MCQ question. What is 2+2?', type: 'MCQ', options: ['3', '4', '5', '6'], correctAnswer: '4' },
      { id: 'def_q2', text: 'This is another sample question.', type: 'MCQ', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
    ],
    status: 'Published',
  }
};


export default function ExamPage() {
  const params = useParams();
  const examId = typeof params.examId === 'string' ? params.examId : 'default_exam';
  const [testPaper, setTestPaper] = useState<TestPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      // Construct a more specific key for mockTestPapers if needed, e.g. prepend "exam_" if id is just a number
      const paperKey = mockTestPapers[examId] ? examId : `exam_${examId}`;
      const fetchedTestPaper = mockTestPapers[paperKey] || mockTestPapers[examId] || mockTestPapers['default_exam'];
      
      if (fetchedTestPaper) {
        let durationInMinutes = fetchedTestPaper.duration;
        if (fetchedTestPaper.durationUnit === 'hours') {
          durationInMinutes = fetchedTestPaper.duration * 60;
        }
        
        setTestPaper({...fetchedTestPaper, duration: durationInMinutes});
        setError(null);
      } else {
        setError('Test paper not found.');
        setTestPaper(null);
      }
      setLoading(false);
    }, 500);
  }, [examId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading exam...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    );
  }

  if (!testPaper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">Could not load the exam. Please try again later.</p>
      </div>
    );
  }

  return <ExamInterface testPaper={testPaper} />;
}
