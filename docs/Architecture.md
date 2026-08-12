# Core Application User Journey

The following flowchart outlines the primary user friction-less journey from landing on the application to reaching exam readiness status.

```mermaid
graph TD
    Landing[Landing Page] --> Auth(Login / Register)
    Auth --> Onboarding(Onboarding)
    Onboarding --> SelectExam(Select Exam)
    SelectExam --> DiagnosticTest[Diagnostic Test]
    DiagnosticTest --> AIAnalysis(AI Analysis)
    AIAnalysis --> SkillMap(Skill Map)
    SkillMap --> PersonalizedPlan(Personalized Study Plan)
    PersonalizedPlan --> Dashboard[Dashboard]
    
    Dashboard --> Learn(Learn)
    Dashboard --> Practice(Practice)
    
    Learn --> AITutor(AI Tutor)
    Practice --> AdaptiveQuestions(Adaptive Questions)
    
    AITutor --> MiniAssessment[Mini Assessment]
    AdaptiveQuestions --> MiniAssessment
    
    MiniAssessment --> PerfAnalysis(Performance Analysis)
    PerfAnalysis --> UpdatedPlan(Updated Plan)
    UpdatedPlan --> MockTest(Mock Test)
    MockTest --> Readiness(Exam Readiness)
```

## Journey Phases

1. **Onboarding & Assessment**: The user creates an account, selects their target exam, and immediately takes a diagnostic test.
2. **AI Planning**: The platform analyzes the diagnostic results to build a detailed `Skill Map` outlining weak and strong areas, finishing with a generated `Personalized Study Plan`.
3. **Core Loop (Learn & Practice)**: The user accesses the `Dashboard` and cycles between Learning (with an `AI Tutor`) and Practicing (`Adaptive Questions`).
4. **Evaluation**: Iteration is verified through `Mini Assessments` leading to `Performance Analysis`.
5. **Mastery Validation**: The `Updated Plan` scales the user towards a full-length `Mock Test`, ultimately evaluating their final `Exam Readiness`.
