import { describe, it, expect } from 'vitest';
import { WorkloadBalancerEngine } from '../src/workload/WorkloadBalancerEngine.js';

describe('Wave 32: WorkloadBalancerEngine', () => {
  const engine = WorkloadBalancerEngine.getInstance();

  it('generates a balanced weekly workload plan respecting student daily caps', () => {
    const laraPlan = engine.generateWeeklyPlan('lara');
    expect(laraPlan.studentId).toBe('lara');
    expect(laraPlan.studentDisplayName).toBe('Lara');
    expect(laraPlan.dailyCapMins).toBe(25);
    expect(laraPlan.cognitiveFatigueAvoidanceScore).toBeGreaterThanOrEqual(90);

    const days = Object.keys(laraPlan.balancedDailyDistribution);
    expect(days.length).toBe(5);

    // Verify cognitive stagger: each day has distinct subject focus
    const subjectsScheduled = days.map((d) => laraPlan.balancedDailyDistribution[d]![0]!.subject);
    expect(subjectsScheduled).toContain('maths');
    expect(subjectsScheduled).toContain('english');
    expect(subjectsScheduled).toContain('science');

    // Verify ADHD sensory notes are present
    const sundayItem = laraPlan.balancedDailyDistribution[days[0]!]![0]!;
    expect(sundayItem.sensoryAccommodationNotes.length).toBeGreaterThan(10);
    expect(sundayItem.sensoryAccommodationNotesAr.length).toBeGreaterThan(10);
  });

  it('generates an RFC 5545 compliant iCalendar (.ics) feed', () => {
    const ics = engine.generateIcsFeed('lara');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//HEX-AIM//Cognitive Homework Balancer v1.0//EN');
    expect(ics).toContain('X-WR-CALNAME:AIM Homework - Lara');
    expect(ics).toContain('X-WR-TIMEZONE:Africa/Cairo');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('UID:hw_lara_');
    expect(ics).toContain('SUMMARY:🎯 AIM:');
    expect(ics).toContain('DESCRIPTION:');
    expect(ics).toContain('CATEGORIES:EDUCATION,HOMEWORK,AIM');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');

    // CRLF line endings per RFC 5545
    expect(ics).toContain('\r\n');
  });
});
