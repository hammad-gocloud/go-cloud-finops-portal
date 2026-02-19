"use client"

import Image from "next/image"
import type { User } from "@/src/api/api"

interface MentionTextProps {
  text: string
  users?: User[]
  // Optional backend-provided mention IDs to bias resolution
  mentionIds?: number[]
  className?: string
}

// Parse comment text and return segments with mentions identified.
// Mentions are assumed to be in the form "@Full Name" where Full Name can include spaces, hyphens, and apostrophes,
// and ends at punctuation or line boundaries.
const parseMentionSegments = (
  text: string,
  users: User[] = [],
  mentionIds?: number[]
) => {
  const segments: Array<
    | { type: "text"; value: string }
    | { type: "mention"; value: string; user?: User }
  > = []

  const idSet = new Set(mentionIds || [])

  const findUserForName = (rawName: string) => {
    const name = rawName.trim().toLowerCase()
    // Prefer users explicitly listed in mentionIds when available
    const pool = idSet.size ? users.filter((u) => idSet.has(u.id)) : users
    // Exact match on full name
    let found = pool.find(
      (u) => u.fullName.trim().toLowerCase() === name
    )
    if (found) return found
    // Prefix match on full name (handles @Sami matching "Sami Ullah")
    found = pool.find((u) =>
      u.fullName.trim().toLowerCase().startsWith(name)
    )
    if (found) return found
    // First-name exact match
    found = pool.find((u) => {
      const first = u.fullName.split(/\s+/)[0]?.toLowerCase() || ""
      return first === name
    })
    return found
  }

  let i = 0
  while (i < text.length) {
    const atIndex = text.indexOf("@", i)
    if (atIndex === -1) {
      segments.push({ type: "text", value: text.slice(i) })
      break
    }
    if (atIndex > i) {
      segments.push({ type: "text", value: text.slice(i, atIndex) })
    }

    const after = text.slice(atIndex + 1)
    // Support ID-based syntax like @{123}, @[123], <123>, or id:123
    const idSyntax = after.match(/^(\{(\d+)\}|\[(\d+)\]|<(\d+)>|id:(\d+))/)
    if (idSyntax) {
      const raw = idSyntax[1]
      const idStr = idSyntax[2] || idSyntax[3] || idSyntax[4] || idSyntax[5]
      const idNum = idStr ? parseInt(idStr, 10) : NaN
      const userById = users.find((u) => u.id === idNum)
      segments.push({ type: "mention", value: `@${raw}`, user: userById })
      i = atIndex + 1 + raw.length
      continue
    }

    // Capture a name token possibly containing spaces, hyphens, apostrophes.
    // Stop at punctuation, another '@', or whitespace boundary followed by punctuation.
    const match = after.match(/^([^\s.,;:()\[\]{}!?#@]+(?:[ \-'][^\s.,;:()\[\]{}!?#@]+)*)/)
    const name = match ? match[1] : ""

    if (!name) {
      // No usable mention; treat '@' as a normal character
      segments.push({ type: "text", value: "@" })
      i = atIndex + 1
      continue
    }

    const mentionValue = `@${name}`
    const user = findUserForName(name)
    segments.push({ type: "mention", value: mentionValue, user })
    i = atIndex + 1 + name.length
  }

  return segments
}

export function MentionText({ text, users = [], mentionIds, className }: MentionTextProps) {
  const segments = parseMentionSegments(text, users, mentionIds)

  return (
    <p className={className ?? "text-sm break-words"}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") return <span key={idx}>{seg.value}</span>
        // Only highlight mentions when we can resolve them to a known user.
        if (!seg.user) return <span key={idx}>{seg.value}</span>
        const displayName = seg.user.fullName
        const avatarSrc = seg.user.profile?.url || "/placeholder-user.jpg"
        return (
          <span
            key={idx}
            className="inline-flex items-center gap-1 align-middle px-2 py-0.5 rounded-full bg-muted text-foreground border border-blue-500 dark:border-blue-400 mx-0.5"
          >
            <span className="relative h-4 w-4 overflow-hidden rounded-full flex-shrink-0">
              <Image src={avatarSrc} alt={displayName} fill className="object-cover" />
            </span>
            <span className="text-xs sm:text-sm">
              @{displayName}
            </span>
          </span>
        )
      })}
    </p>
  )
}