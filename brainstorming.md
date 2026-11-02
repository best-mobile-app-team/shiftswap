# App Idea Brainstorming

**Group 7: Best Mobile App Team**
Zachri Hall, Yuliya Orlinova, Edward Del Pino, Julian Lesesne

## Step 1: Initial Brainstorming Ideas

### 1. ShiftSwap
Hourly workers post a shift they can't cover, coworkers claim it, and a manager approves it with one tap. Push notifications on new posts. Replaces the group chat every restaurant, clinic, gym and barbershop currently uses for this.

### 2. Casos Mobile
A clinician-facing iOS client for an ABA therapy staffing board. Clinicians browse open cases near them, filter by commute, hours and credential, and express interest without an account. Reads from an existing REST backend.

### 3. PickUp
A map of local pickup basketball, soccer and volleyball games. Drop a pin, set a time, other players RSVP and see who's coming. Built on MapKit and a real-time database.

### 4. Walk-In
Live wait times for barbershops and salons. The shop updates "3 ahead, about 25 minutes" from a one-button screen. Customers see it on a map, tap "I'm on my way," and hold a spot in line.

### 5. StudyStreak
A study timer you run with friends. Start a session, friends see you're live, keep daily streaks and compete on a weekly leaderboard.

### 6. Chore Wheel
A shared chore board for roommates. Chores auto-rotate weekly, anyone can mark one done, and everyone can see who's behind.

## Step 2: Evaluating Top 3 Ideas

### ShiftSwap

- **Mobile:** Shift coverage happens away from a desk, often the same day. Push notifications are the whole point: a posted shift needs to reach people wherever they are, and claiming one should take a single tap. Camera is not needed, but location can scope posts to a workplace. This is a uniquely mobile experience.
- **Story:** Clear and immediate. Everyone who has worked an hourly job has either begged a group chat for coverage or scrolled past someone else begging. The value is obvious in one sentence.
- **Market:** Every business with hourly staff and variable schedules: restaurants, clinics, gyms, salons, retail. In the United States that is tens of millions of workers. Niche enough to focus, broad enough to matter.
- **Habit:** Workers check it whenever their schedule changes, which for most hourly workers is weekly or more often. Managers check it whenever a shift is posted. Both sides create and consume content.
- **Scope:** Very well defined. The MVP is three screens: a feed of open shifts, a post-shift form, and a claim-and-approve flow. Stretch features are obvious and optional: calendar sync, workplace groups, swap history. A stripped-down version is still interesting and fully demoable.

### Walk-In

- **Mobile:** Live wait time is inherently real-time and location based. Map, push, and a one-tap "on my way" all make sense only on a phone.
- **Story:** Strong. Nobody likes showing up to a two-hour wait. Shops hate no-shows. Both sides get something.
- **Market:** Large, but the app is only useful once shops near you adopt it, which is a two-sided cold-start problem. One pilot shop is available to the team, which helps the demo but not the market story.
- **Habit:** Customers use it a few times a month. Shops update it constantly during open hours. Uneven, and most of the engagement sits on the shop side.
- **Scope:** Two distinct interfaces (shop and customer) means more surface area than it first appears. The MVP is doable, but the shop side has to be built before the customer side is useful.

### PickUp

- **Mobile:** Maps, location and real-time RSVP are all native mobile strengths. Great Demo Day visual.
- **Story:** Clear. "Find a game near you tonight." Easy to pitch.
- **Market:** Casual athletes in any city. Real but fuzzy, and it competes with existing group chats and Meetup-style apps. Harder to explain why someone would switch.
- **Habit:** Weekly at most for most users, and only during the sports they play. Engagement is seasonal and depends on a critical mass of nearby games existing.
- **Scope:** Simple MVP, but the app is empty until enough people post games, which is a cold-start problem the team cannot solve during the course.

## Step 3: Final App Idea

**ShiftSwap**

It wins on scope and habit. The MVP is three screens and the feature set splits cleanly across four people. It avoids the two-sided cold-start problem that weakens Walk-In and PickUp, because a single workplace with a handful of coworkers already gets full value from it. The story is instant and every teammate has lived the problem it solves.
