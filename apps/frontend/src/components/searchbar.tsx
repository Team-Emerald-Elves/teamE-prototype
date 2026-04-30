import { Search } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
export function SearchBar() {
    return (
        <InputGroup className="w-full max-w-3xl py-0.75 border-0 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer bg-input">
            <InputGroupInput placeholder="Search for content..." />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}
