import type { Attribute, Schema } from '@strapi/strapi';

export interface EngineEngine extends Schema.Component {
  collectionName: 'components_engine_engines';
  info: {
    displayName: 'engine';
  };
  attributes: {
    hours: Attribute.Integer;
    model: Attribute.String & Attribute.Required;
  };
}

export interface SpecsComponent extends Schema.Component {
  collectionName: 'components_specs_components';
  info: {
    displayName: 'component';
    icon: 'cog';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    notes: Attribute.Text;
    value: Attribute.String;
  };
}

export interface SpecsEngine extends Schema.Component {
  collectionName: 'components_specs_engines';
  info: {
    displayName: 'engine';
    icon: 'cog';
  };
  attributes: {
    cycles: Attribute.Integer;
    hours: Attribute.Integer;
    model: Attribute.String;
    notes: Attribute.Text;
  };
}

export interface UnitUnitHours extends Schema.Component {
  collectionName: 'components_unit_unit_hours';
  info: {
    displayName: 'unit-hours';
  };
  attributes: {
    hours: Attribute.Integer;
    name: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'engine.engine': EngineEngine;
      'specs.component': SpecsComponent;
      'specs.engine': SpecsEngine;
      'unit.unit-hours': UnitUnitHours;
    }
  }
}
