import { StudentIdentityVault } from './StudentIdentityVault.js';

export interface HydratedEgressArtifact {
  internalUid: string;
  egressFilename: string;
  egressTitle: string;
  egressCaption: string;
  displayName: string;
  parentSalutation: string;
}

/**
 * ADR-002 Presentation Egress Hydrator:
 * Dynamically binds customer-facing student names and personalized parental titles
 * ONLY at delivery egress time. The internal processing engine remains 100% anonymous.
 */
export class DynamicPresentationHydrator {
  /**
   * Hydrates a Student Sprint Pack for Telegram/WhatsApp/Console delivery.
   */
  public static hydrateSprintEgress(
    studentUid: string,
    subjectTitle: string,
    week: number,
    extension = 'pdf'
  ): HydratedEgressArtifact {
    const vault = StudentIdentityVault.getInstance();
    const identity = vault.getIdentity(studentUid);
    const displayName = identity?.displayName || 'Student';
    const parentTitle = identity?.preferredParentTitle || 'Parent';

    const safeSubject = subjectTitle.replace(/\s+/g, '_');
    const egressFilename = `${displayName}_${safeSubject}_Y4_Sprint_W${week}.${extension}`;
    const egressTitle = `${displayName}'s 4-Page ${subjectTitle} Learning Sprint (Week ${week})`;
    const egressCaption = `📄 <b>${displayName}'s ${subjectTitle} Sprint Pack</b>\n🎯 Week ${week} • Targeted Practice & Visual Scaffolds`;

    return {
      internalUid: identity?.studentUid || studentUid,
      egressFilename,
      egressTitle,
      egressCaption,
      displayName,
      parentSalutation: parentTitle,
    };
  }

  /**
   * Hydrates a Parent Socratic Coaching Guide for delivery.
   */
  public static hydrateGuideEgress(
    studentUid: string,
    subjectTitle: string,
    week: number,
    extension = 'pdf'
  ): HydratedEgressArtifact {
    const vault = StudentIdentityVault.getInstance();
    const identity = vault.getIdentity(studentUid);
    const displayName = identity?.displayName || 'Student';
    const parentTitle = identity?.preferredParentTitle || 'Dad';

    const safeSubject = subjectTitle.replace(/\s+/g, '_');
    const egressFilename = `${parentTitle}s_${displayName}_${safeSubject}_Socratic_Guide_W${week}.${extension}`;
    const egressTitle = `${parentTitle}'s Socratic Coaching Guide for ${displayName}`;
    const egressCaption = `🧭 <b>${parentTitle}'s Socratic Guide for ${displayName}</b>\n🎯 ${subjectTitle} Week ${week} • Verbal Cues & What NOT to Say`;

    return {
      internalUid: identity?.studentUid || studentUid,
      egressFilename,
      egressTitle,
      egressCaption,
      displayName,
      parentSalutation: parentTitle,
    };
  }
}
