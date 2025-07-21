export namespace DesignTokens {
  export type Theme = 'dark' | 'light';
  export type Color = 'light' | 'dark';
  export type Align = 'left' | 'center' | 'right' | 'justify';
  export type MarginTop = 'small' | 'medium' | 'large';
}

export namespace ShadowOptions {
  export type Type = '' | 'light-shadow' | 'dark-shadow';
  export type Raw = '' | DesignTokens.Theme;
}

export namespace BlockOptions {
  export type Theme = DesignTokens.Theme;
}

export namespace ButtonOptions {
  export type Theme = DesignTokens.Theme;
}

export namespace ParagraphOptions {
  export type Size = 'small' | 'medium' | 'large';
  export type Align = DesignTokens.Align;
  export type Weight = 'normal' | 'bold';
  export type Color = DesignTokens.Color;
  export type MaxWidth = 'narrow' | 'wide' | 'full';
  export type Type = 'normal' | 'blur';
}

export namespace TitleOptions {
  export type Type = 'blur' | 'cornered' | 'simple' | 'soft';
  export type Align = DesignTokens.Align;
  export type Color = DesignTokens.Color;
  export type Level = 'h1' | 'h2' | 'h3';
}
