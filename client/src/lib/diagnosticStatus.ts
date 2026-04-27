export type DiagnosticStatusState =
  | "supported"
  | "unsupported"
  | "permission-required"
  | "permission-denied"
  | "device-unavailable"
  | "device-busy"
  | "ready"
  | "active"
  | "failed";

export interface DiagnosticStatus {
  state: DiagnosticStatusState;
  title: string;
  description: string;
  actionLabel?: string;
  notes?: string[];
}

export function createDiagnosticStatus(
  state: DiagnosticStatusState,
  title: string,
  description: string,
  options?: Pick<DiagnosticStatus, "actionLabel" | "notes">,
): DiagnosticStatus {
  return {
    state,
    title,
    description,
    actionLabel: options?.actionLabel,
    notes: options?.notes,
  };
}

export function supportsMediaDevices() {
  return Boolean(
    typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function",
  );
}

export function supportsMediaRecorder() {
  return typeof MediaRecorder !== "undefined";
}

export function supportsGamepadApi() {
  return Boolean(
    typeof navigator !== "undefined" &&
      typeof navigator.getGamepads === "function",
  );
}

export function supportsWebAudio() {
  return Boolean(
    typeof window !== "undefined" &&
      (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext),
  );
}

export function getMicrophonePreflightStatus(): DiagnosticStatus {
  if (!supportsMediaDevices()) {
    return createDiagnosticStatus(
      "unsupported",
      "Microphone Test Unavailable",
      "This browser does not expose the media APIs required for microphone capture.",
      {
        notes: ["Try a current version of Chrome, Edge, Firefox, or Safari."],
      },
    );
  }

  if (!supportsMediaRecorder()) {
    return createDiagnosticStatus(
      "unsupported",
      "Recording Not Supported",
      "Your browser can request microphone access, but it does not support the recording APIs used by this test.",
      {
        notes: ["Try Chrome or Edge for the most reliable recording support."],
      },
    );
  }

  return createDiagnosticStatus(
    "permission-required",
    "Microphone Permission Required",
    "Recording starts only after you grant microphone access in the browser prompt or address bar.",
    {
      actionLabel: "Start Recording",
    },
  );
}

export function getWebcamPreflightStatus(): DiagnosticStatus {
  if (!supportsMediaDevices()) {
    return createDiagnosticStatus(
      "unsupported",
      "Webcam Test Unavailable",
      "This browser does not expose the media APIs required for webcam preview.",
      {
        notes: ["Try a current version of Chrome, Edge, Firefox, or Safari."],
      },
    );
  }

  return createDiagnosticStatus(
    "permission-required",
    "Camera Permission Required",
    "The webcam preview starts only after you grant camera access in the browser prompt or address bar.",
    {
      actionLabel: "Start Camera",
    },
  );
}

export function getGamepadPreflightStatus(hasGamepads: boolean): DiagnosticStatus {
  if (!supportsGamepadApi()) {
    return createDiagnosticStatus(
      "unsupported",
      "Gamepad API Unavailable",
      "This browser does not expose the Gamepad API required for controller diagnostics.",
      {
        notes: ["Chrome and Edge currently provide the most reliable Gamepad API support."],
      },
    );
  }

  if (!hasGamepads) {
    return createDiagnosticStatus(
      "device-unavailable",
      "Controller Not Connected",
      "Connect a controller and press any button to wake it up, then the live visualizer and drift tools will activate.",
      {
        notes: ["Some wireless controllers only appear after a face button or trigger is pressed."],
      },
    );
  }

  return createDiagnosticStatus(
    "ready",
    "Controller Ready",
    "Live input is available. You can inspect buttons, analog axes, drift behavior, and vibration support.",
  );
}

export function getAudioSyncPreflightStatus(): DiagnosticStatus {
  if (!supportsWebAudio()) {
    return createDiagnosticStatus(
      "unsupported",
      "Audio Latency Test Unavailable",
      "This browser does not support the Web Audio APIs required for the latency test.",
      {
        notes: ["Try Chrome, Edge, or Safari on a recent OS version."],
      },
    );
  }

  return createDiagnosticStatus(
    "ready",
    "Audio Latency Test Ready",
    "Use speakers or headphones with audible volume. Starting the sequence will prepare browser audio playback before the timed beep begins.",
    {
      actionLabel: "Start Sequence",
    },
  );
}

export function classifyMediaError(
  err: unknown,
  deviceLabel: "microphone" | "camera",
): DiagnosticStatus {
  const error = err as { name?: string; message?: string } | undefined;
  const name = error?.name;

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return createDiagnosticStatus(
      "permission-denied",
      `${capitalize(deviceLabel)} Permission Denied`,
      `Allow ${deviceLabel} access in your browser address bar, then try again.`,
    );
  }

  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return createDiagnosticStatus(
      "device-unavailable",
      `No ${capitalize(deviceLabel)} Detected`,
      `Connect a ${deviceLabel} or enable the built-in ${deviceLabel}, then try again.`,
    );
  }

  if (name === "NotReadableError" || name === "TrackStartError") {
    return createDiagnosticStatus(
      "device-busy",
      `${capitalize(deviceLabel)} Busy`,
      `Another app is already using the ${deviceLabel}. Close video, call, or recording apps and try again.`,
    );
  }

  if (name === "NotSupportedError") {
    return createDiagnosticStatus(
      "unsupported",
      `${capitalize(deviceLabel)} API Unsupported`,
      `This browser does not support the ${deviceLabel} APIs required for this test.`,
    );
  }

  return createDiagnosticStatus(
    "failed",
    `${capitalize(deviceLabel)} Error`,
    error?.message || `Could not access the ${deviceLabel}.`,
  );
}

export function getGamepadVibrationNotes(gamepad: Gamepad | null): string[] {
  if (!gamepad) {
    return ["Connect a controller first to check whether vibration is exposed in this browser."];
  }

  const vibrationActuator = (
    gamepad as Gamepad & {
      vibrationActuator?: unknown;
      hapticActuators?: unknown[];
    }
  ).vibrationActuator;
  const hapticActuators = (
    gamepad as Gamepad & {
      vibrationActuator?: unknown;
      hapticActuators?: unknown[];
    }
  ).hapticActuators;

  if (vibrationActuator) {
    return ["This browser and controller expose vibration support through the Gamepad API."];
  }

  if (hapticActuators && hapticActuators.length > 0) {
    return ["This controller exposes legacy haptic actuators. A fallback vibration path is available."];
  }

  return [
    "Vibration is not exposed for this browser and controller combination.",
    "Chrome and Edge usually provide the best controller haptics support.",
  ];
}

function capitalize(value: string) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
