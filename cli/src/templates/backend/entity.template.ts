export const entityTemplate = `import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('{{plural.param}}')
export class {{singular.pascal}} {
  @PrimaryGeneratedColumn()
  id: number;

{{#each fields}}
{{#if (eq this.type 'string')}}
  @Column({{#if this.required}}{ length: {{#if (eq this.name 'description')}}500{{else if (eq this.name 'symbol')}}10{{else if (eq this.name 'code')}}20{{else}}100{{/if}} }{{else}}{ type: 'varchar', length: {{#if (eq this.name 'description')}}500{{else if (eq this.name 'symbol')}}10{{else}}100{{/if}}, nullable: true }{{/if}})
  {{this.name}}{{#unless this.required}}?{{/unless}}: {{this.tsType}};
{{else if (eq this.type 'number')}}
  @Column({ type: 'float', nullable: true, default: 1 })
  {{this.name}}?: {{this.tsType}};
{{else if (eq this.type 'boolean')}}
  @Column({ default: true })
  {{this.name}}?: {{this.tsType}};
{{else}}
  @Column({{#if this.required}}{ nullable: false }{{else}}{ nullable: true }{{/if}})
  {{this.name}}{{#unless this.required}}?{{/unless}}: {{this.tsType}};
{{/if}}

{{/each}}
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'creatorId' })
  creator?: User;

  @Column({ nullable: true })
  creatorId?: string;
}`;