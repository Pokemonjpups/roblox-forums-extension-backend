import { Required, MaxLength, MinLength } from "@tsed/common";

export class CreateThreadRequest {
    @Required()
    auth: string;
    @Required()
    @MinLength(1)
    @MaxLength(64)
    title: string;
    @Required()
    @MinLength(4)
    @MaxLength(4096)
    body: string;
    @Required()
    category: number;
}

export class CreatePostRequest {
    @Required()
    auth: string;
    @Required()
    @MinLength(4)
    @MaxLength(4096)
    body: string;
}