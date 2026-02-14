
-- Add CHECK constraints for text length limits on all user-facing tables

-- assignments
ALTER TABLE public.assignments
  ADD CONSTRAINT chk_assignments_title_len CHECK (char_length(title) <= 200),
  ADD CONSTRAINT chk_assignments_desc_len CHECK (char_length(description) <= 1000),
  ADD CONSTRAINT chk_assignments_subject_len CHECK (char_length(subject) <= 100);

-- exams
ALTER TABLE public.exams
  ADD CONSTRAINT chk_exams_name_len CHECK (char_length(name) <= 200),
  ADD CONSTRAINT chk_exams_subject_len CHECK (char_length(subject) <= 100),
  ADD CONSTRAINT chk_exams_notes_len CHECK (char_length(notes) <= 1000);

-- subjects
ALTER TABLE public.subjects
  ADD CONSTRAINT chk_subjects_name_len CHECK (char_length(name) <= 100);

-- topics
ALTER TABLE public.topics
  ADD CONSTRAINT chk_topics_subject_len CHECK (char_length(subject) <= 100),
  ADD CONSTRAINT chk_topics_name_len CHECK (char_length(topic_name) <= 200);

-- timetable_entries
ALTER TABLE public.timetable_entries
  ADD CONSTRAINT chk_timetable_subject_len CHECK (char_length(subject) <= 100),
  ADD CONSTRAINT chk_timetable_location_len CHECK (char_length(location) <= 200);

-- performance_records
ALTER TABLE public.performance_records
  ADD CONSTRAINT chk_perf_subject_len CHECK (char_length(subject) <= 100),
  ADD CONSTRAINT chk_perf_test_name_len CHECK (char_length(test_name) <= 200),
  ADD CONSTRAINT chk_perf_marks_range CHECK (marks >= 0 AND marks <= 10000),
  ADD CONSTRAINT chk_perf_total_marks_range CHECK (total_marks >= 1 AND total_marks <= 10000);

-- profiles
ALTER TABLE public.profiles
  ADD CONSTRAINT chk_profiles_name_len CHECK (char_length(name) <= 100),
  ADD CONSTRAINT chk_profiles_goal_range CHECK (daily_study_goal >= 1 AND daily_study_goal <= 1440);

-- water_log
ALTER TABLE public.water_log
  ADD CONSTRAINT chk_water_amount_range CHECK (amount_ml >= 1 AND amount_ml <= 10000);

-- study_sessions
ALTER TABLE public.study_sessions
  ADD CONSTRAINT chk_session_duration_range CHECK (duration >= 0 AND duration <= 1440);
