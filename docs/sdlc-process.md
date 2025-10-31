# Software Development Life Cycle (SDLC)

## Project Methodology: Agile - Scrum

### Why Agile/Scrum?

For this restaurant reservation system project, we've chosen **Agile with Scrum framework** because:

✅ **Flexibility**: Requirements can evolve as we learn  
✅ **Iterative**: Build and test features incrementally  
✅ **Team Collaboration**: Regular communication and feedback  
✅ **Risk Mitigation**: Early detection of issues  
✅ **Educational**: Industry-standard methodology  
✅ **Perfect for 8-week timeline**: Short sprints keep us on track

---

## Scrum Framework Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCT BACKLOG                      │
│  (All features and requirements for the entire project) │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Sprint Planning
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    SPRINT BACKLOG                       │
│       (Selected tasks for this 2-week sprint)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Daily Standups (15 min)
                     ↓
┌─────────────────────────────────────────────────────────┐
│                 SPRINT (2 WEEKS)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Week 1  │  │  Week 2  │  │   Done   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Sprint Review + Retrospective
                     ↓
┌─────────────────────────────────────────────────────────┐
│              POTENTIALLY SHIPPABLE PRODUCT              │
└─────────────────────────────────────────────────────────┘
```

---

## Scrum Roles

### 1. Product Owner
**Who**: One team member (rotates each sprint)  
**Responsibilities**:
- Maintain and prioritize product backlog
- Define user stories and acceptance criteria
- Make decisions on features
- Accept or reject completed work
- Communicate with "stakeholders" (professor)

### 2. Scrum Master
**Who**: One team member (rotates each sprint)  
**Responsibilities**:
- Facilitate all Scrum ceremonies
- Remove blockers for the team
- Ensure Scrum practices are followed
- Keep team focused on sprint goal
- Track sprint progress

### 3. Development Team
**Who**: All 4 team members  
**Responsibilities**:
- Self-organize to complete sprint tasks
- Develop, test, and document features
- Collaborate and help each other
- Participate in all Scrum ceremonies
- Deliver working software each sprint

---

## Sprint Structure (2-Week Sprints)

### Sprint Duration: **2 Weeks (10 working days)**
### Total Sprints: **4 sprints over 8 weeks**

---

## Scrum Ceremonies

### 1. Sprint Planning Meeting
**When**: First day of sprint (Monday)  
**Duration**: 2 hours  
**Attendees**: All team members

**Agenda**:
1. **Review sprint goal** (30 min)
   - What do we want to achieve this sprint?
   - Which features are most important?

2. **Select user stories from backlog** (60 min)
   - Team collectively chooses stories
   - Estimate effort for each story
   - Ensure workload is realistic

3. **Break down into tasks** (30 min)
   - Convert user stories into technical tasks
   - Assign initial owners (flexible)
   - Define "Definition of Done" for each task

**Output**: Sprint Backlog (list of tasks for the sprint)

---

### 2. Daily Standup
**When**: Every day at same time  
**Duration**: 15 minutes maximum  
**Attendees**: All team members  
**Format**: Stand-up (literally stand to keep it short)

**Each person answers 3 questions**:
1. ✅ **What did I complete yesterday?**
2. 🚀 **What will I work on today?**
3. 🚧 **Any blockers or issues?**

**Rules**:
- Keep it brief and focused
- No problem-solving in standup (take offline)
- Update task board during or right after
- If someone is blocked, Scrum Master helps after meeting

**Example**:
> "Yesterday I completed the login API endpoint. Today I'll work on the registration endpoint. I'm blocked waiting for the database schema to be finalized."

---

### 3. Sprint Review (Demo)
**When**: Last day of sprint (Friday Week 2)  
**Duration**: 1 hour  
**Attendees**: All team members + professor (if available)

**Agenda**:
1. **Demo completed features** (40 min)
   - Show working software (not slides!)
   - Each person demos what they built
   - Get feedback

2. **Review sprint goals** (10 min)
   - Did we complete what we planned?
   - What wasn't finished and why?

3. **Backlog refinement** (10 min)
   - Update backlog based on progress
   - Adjust priorities for next sprint

**Output**: Feedback and updated backlog

---

### 4. Sprint Retrospective
**When**: After Sprint Review (Friday Week 2)  
**Duration**: 1 hour  
**Attendees**: All team members (internal only)

**Agenda**: Reflect on the process, not the product

1. **What went well?** (20 min)
   - Celebrate successes
   - What should we keep doing?

2. **What didn't go well?** (20 min)
   - Identify problems and frustrations
   - Be honest but respectful

3. **Action items for improvement** (20 min)
   - Concrete steps to improve next sprint
   - Assign owners to each action

**Example Topics**:
- Communication (Discord response times)
- Code reviews (too slow/too fast)
- Merge conflicts (how to avoid)
- Testing (need more/better tests)
- Documentation (need to improve)

**Output**: 2-3 actionable improvements for next sprint

---

## Project Timeline (8 Weeks = 4 Sprints)

### Sprint 1: Foundation (Weeks 1-2)
**Sprint Goal**: Set up project infrastructure and documentation

**Key Deliverables**:
- [x] Project structure created
- [x] All documentation written
- [ ] Development environment setup (all 4 members)
- [ ] Database schema implemented
- [ ] Basic authentication (register/login)
- [ ] CI/CD pipeline setup (GitHub Actions)

**User Stories**:
1. As a developer, I want a clear project structure so I know where to put my code
2. As a developer, I want the database set up so I can start building features
3. As a customer, I want to register an account so I can make reservations

---

### Sprint 2: Core Features (Weeks 3-4)
**Sprint Goal**: Implement basic reservation functionality

**Key Deliverables**:
- [ ] Customer can create reservations (form-based)
- [ ] Customer can view their reservations
- [ ] Admin can view all reservations
- [ ] Admin can manage tables
- [ ] Basic menu display
- [ ] Email confirmation system

**User Stories**:
1. As a customer, I want to book a reservation so I can dine at the restaurant
2. As a customer, I want to see my reservations so I can remember when I'm dining
3. As an admin, I want to see all reservations so I can manage the restaurant
4. As an admin, I want to add tables so I can accept reservations

---

### Sprint 3: Advanced Features (Weeks 5-6)
**Sprint Goal**: Add AI chatbot and real-time kitchen display

**Key Deliverables**:
- [ ] AI chatbot for reservations (OpenAI integration)
- [ ] Kitchen Display System (KDS)
- [ ] Real-time order updates (WebSocket)
- [ ] Order management system
- [ ] Reservation modification/cancellation
- [ ] Admin dashboard with statistics

**User Stories**:
1. As a customer, I want to book via AI chatbot so I can have a natural conversation
2. As kitchen staff, I want to see orders in real-time so I can prepare food efficiently
3. As a server, I want to create orders so customers can place food orders
4. As an admin, I want to see statistics so I can understand my business

---

### Sprint 4: Polish & Deployment (Weeks 7-8)
**Sprint Goal**: Testing, bug fixes, deployment, and final presentation

**Key Deliverables**:
- [ ] Comprehensive testing (unit + integration)
- [ ] Bug fixes from testing
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Deployment to production
- [ ] User documentation
- [ ] Final presentation preparation
- [ ] Video demo recording

**User Stories**:
1. As a user, I want a fast and bug-free experience
2. As a developer, I want good test coverage so I'm confident in my code
3. As a team, I want to deliver a polished product for the final demo

---

## User Story Format

### Template:
```
As a [role],
I want [feature],
So that [benefit].
```

### Acceptance Criteria:
```
Given [context],
When [action],
Then [outcome].
```

### Example User Story:
```
Title: Customer Registration

As a customer,
I want to register an account with email and password,
So that I can make reservations.

Acceptance Criteria:
- Given I'm on the registration page
  When I enter valid email, password, name, and phone
  Then my account is created and I receive a confirmation email

- Given I'm on the registration page
  When I enter an email that's already registered
  Then I see an error message "Email already exists"

- Given I'm on the registration page
  When I enter a password less than 8 characters
  Then I see an error message "Password must be at least 8 characters"

Definition of Done:
✅ Code written and tested
✅ Unit tests pass
✅ Code reviewed by 1 team member
✅ Merged to develop branch
✅ No linter errors
✅ API documentation updated
```

---

## Task Estimation

We use **T-Shirt Sizing** for simplicity:

| Size | Effort | Example |
|------|--------|---------|
| **XS** | 1-2 hours | Add validation to form field |
| **S** | 3-4 hours | Create simple API endpoint |
| **M** | 5-8 hours | Build complete form with validation |
| **L** | 1-2 days | Build dashboard page with data |
| **XL** | 3-5 days | AI chatbot integration |

**Rule**: If a task is XL, break it down into smaller tasks!

---

## Definition of Done (DoD)

A task is considered "Done" when:

### Code Quality:
✅ Code written and functional  
✅ No ESLint errors  
✅ Code follows team conventions  
✅ Comments for complex logic  

### Testing:
✅ Unit tests written (for backend)  
✅ Manual testing completed  
✅ No known bugs  

### Code Review:
✅ Pull request created  
✅ At least 1 team member reviewed  
✅ All review comments addressed  
✅ Approved and merged  

### Documentation:
✅ API documentation updated (if applicable)  
✅ README updated (if needed)  
✅ Comments in code explain "why" not "what"  

---

## Backlog Management

### Product Backlog
**Tool**: GitHub Projects or Trello

**Prioritization** (MoSCoW Method):
- **Must Have**: Core functionality (authentication, reservations)
- **Should Have**: Important but not critical (AI chatbot)
- **Could Have**: Nice to have (analytics, reports)
- **Won't Have**: Out of scope (payment processing, mobile apps)

### Sprint Backlog
**Tool**: GitHub Projects (Sprint board)

**Columns**:
1. **To Do** - Not started
2. **In Progress** - Currently working
3. **In Review** - Pull request open
4. **Done** - Merged and deployed

**Rules**:
- Only move to "In Progress" when actively working
- Only ONE task "In Progress" per person at a time
- Update board daily
- Move to "Done" only when Definition of Done is met

---

## Team Communication

### Channels:
- **Discord/Slack**: Daily communication, quick questions
- **GitHub**: Code reviews, technical discussions, issues
- **Weekly Meeting**: Sprint ceremonies
- **Email**: Professor communication only

### Response Time Expectations:
- **Urgent blockers**: Within 2 hours
- **Code review requests**: Within 24 hours
- **General questions**: Within 24 hours
- **Planning discussions**: Before next meeting

### Conflict Resolution:
1. **Discuss directly** first (privately)
2. **Bring to team** if unresolved (retrospective)
3. **Scrum Master** mediates if needed
4. **Majority vote** as last resort

---

## Version Control Strategy

### Branch Strategy: Git Flow (Simplified)

```
main (production)
  ↑
  └── develop (integration)
        ↑
        ├── feature/customer-registration
        ├── feature/ai-chatbot
        ├── bugfix/login-error
        └── feature/admin-dashboard
```

### Branch Naming:
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent production fixes
- `docs/description` - Documentation only

### Workflow:
1. Create feature branch from `develop`
2. Make changes and commit
3. Push and create Pull Request
4. Get 1 approval
5. Merge to `develop`
6. Delete feature branch
7. At end of sprint, merge `develop` to `main`

### Commit Message Format:
```
type(scope): description

feat(auth): add user registration endpoint
fix(reservation): resolve double-booking bug
docs(api): update reservation endpoints
style(admin): format dashboard code
refactor(service): simplify email service
test(auth): add login unit tests
```

---

## Code Review Checklist

When reviewing a Pull Request:

### Functionality:
- [ ] Code does what it's supposed to
- [ ] No obvious bugs
- [ ] Edge cases handled

### Code Quality:
- [ ] Code is readable and understandable
- [ ] No duplicate code
- [ ] Functions are small and focused
- [ ] Variable names are descriptive

### Testing:
- [ ] Tests are included (backend)
- [ ] Reviewer manually tested (frontend)

### Standards:
- [ ] Follows team conventions
- [ ] No linter errors
- [ ] No console.logs left in code

### Documentation:
- [ ] Complex logic is commented
- [ ] API docs updated if needed

**Review Time Goal**: Within 24 hours

---

## Risk Management

### Potential Risks:

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Team member drops out | Low | High | Cross-train on all components |
| AI API costs too much | Medium | Medium | Set spending limit, use mock data |
| Merge conflicts | High | Low | Frequent merges, communication |
| Scope creep | Medium | High | Strict backlog prioritization |
| Time management | High | High | Weekly check-ins, adjust scope |
| Technology learning curve | Medium | Medium | Pair programming, documentation |

---

## Metrics & Tracking

### Sprint Metrics:

**Velocity**: Number of story points completed per sprint
- Track to predict future sprint capacity
- Average over 2-3 sprints for accuracy

**Burndown Chart**: Visual of remaining work
- Update daily
- Helps identify if sprint is on track

**Code Metrics**:
- Lines of code (informational only)
- Test coverage % (target: 60%+)
- Number of bugs found
- PR review time

---

## Continuous Integration / Continuous Deployment (CI/CD)

### GitHub Actions Workflow:

**On Pull Request**:
1. Run linter (ESLint)
2. Run tests (Jest)
3. Build project
4. Report status ✅ or ❌

**On Merge to `develop`**:
1. Run all checks
2. Auto-deploy to staging environment

**On Merge to `main`**:
1. Run all checks
2. Auto-deploy to production

---

## Sprint Schedule Example

### Week 1 (Sprint Start)
- **Monday 9 AM**: Sprint Planning (2 hours)
- **Tuesday-Friday 9 AM**: Daily Standup (15 min)
- **Async**: Development work

### Week 2 (Sprint End)
- **Monday-Thursday 9 AM**: Daily Standup (15 min)
- **Friday 2 PM**: Sprint Review (1 hour)
- **Friday 3 PM**: Sprint Retrospective (1 hour)
- **Friday 4 PM**: Sprint Planning for next sprint (2 hours)

---

## Documentation Throughout SDLC

### Continuous Documentation:
- Update `README.md` with setup changes
- Document new API endpoints immediately
- Add inline code comments as you code
- Update architecture docs when design changes

### Sprint End Documentation:
- Sprint summary (what was completed)
- Known issues/bugs
- Decisions made and why
- Updated product backlog

### Final Documentation:
- Complete user guide
- Deployment guide
- API reference (should already be done)
- Architecture diagrams
- Lessons learned document

---

## Quality Assurance

### Testing Strategy:

**Unit Tests** (Backend):
- Test individual functions
- Mock external dependencies
- Target: 60% coverage

**Integration Tests**:
- Test API endpoints end-to-end
- Test database interactions
- Critical user flows

**Manual Testing**:
- Every feature tested before PR
- Cross-browser testing
- Mobile responsiveness
- User acceptance testing (UAT)

**Testing Checklist for Each Feature**:
- [ ] Happy path works
- [ ] Error cases handled
- [ ] Validation works
- [ ] UI is responsive
- [ ] No console errors
- [ ] Data persists correctly

---

## Agile Values Applied

### 1. **Individuals and Interactions** over processes and tools
- Daily standups for face-to-face communication
- Pair programming when stuck
- Help each other succeed

### 2. **Working Software** over comprehensive documentation
- Every sprint delivers functional features
- Documentation supports but doesn't replace working code
- Demo real features, not mockups

### 3. **Customer Collaboration** over contract negotiation
- Product Owner represents "customer"
- Adapt based on feedback
- Show progress early and often

### 4. **Responding to Change** over following a plan
- Adjust backlog based on what we learn
- Re-prioritize if needed
- Sprint retrospectives drive improvement

---

## Success Criteria for SDLC

The SDLC process is successful if:

✅ All sprint ceremonies happen on time  
✅ Sprint goals are met 75%+ of the time  
✅ Team velocity is predictable  
✅ Code review turnaround < 24 hours  
✅ No critical bugs in production  
✅ All team members contribute equally  
✅ Team morale stays positive  
✅ Final product meets requirements  
✅ Documentation is complete and useful  
✅ Project delivered on time  

---

## Tools Summary

| Purpose | Tool | Why |
|---------|------|-----|
| Version Control | Git + GitHub | Industry standard |
| Project Management | GitHub Projects | Integrated with code |
| Communication | Discord/Slack | Real-time chat |
| Code Editor | VS Code | Popular, good extensions |
| API Testing | Postman | Easy to use, shareable |
| Database Management | PostgreSQL + pgAdmin | Visual interface |
| CI/CD | GitHub Actions | Free, easy setup |
| Deployment | Vercel + Render | Free tiers, simple |

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Process Owner**: [Team Name]

---

## Quick Reference Card

### Daily:
- 9 AM: Daily Standup (15 min)
- Update task board
- Respond to PR reviews
- Commit & push code

### Weekly:
- Sprint ceremonies (see schedule)
- Check project velocity
- Update documentation

### Before PR:
- Run tests
- Run linter
- Test manually
- Update docs

### Before Merge:
- Get 1 approval
- All comments addressed
- CI/CD passes
- No merge conflicts

**Remember**: Communication is key! When in doubt, ask the team! 🚀

